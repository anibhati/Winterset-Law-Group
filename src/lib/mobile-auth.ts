// Mobile apps don't carry browser cookies, so NextAuth's normal
// cookie-based session doesn't work for them. This gives the mobile
// app a portable JWT it can store on-device (Keychain/Keystore via
// expo-secure-store) and send as `Authorization: Bearer <token>` on
// every request instead.
//
// Reuses NEXTAUTH_SECRET rather than introducing a second secret to
// manage and rotate.

import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET;

if (!SECRET) {
  throw new Error("NEXTAUTH_SECRET is required for mobile auth tokens.");
}

export interface MobileTokenPayload {
  userId: string;
  email: string;
  role: string;
}

// 30 days — mobile apps generally expect to stay logged in long-term,
// unlike the 8-hour web session. Reasonable for this use case since the
// token only grants the same access the user already has via the web
// session strategy, and can be revoked by rotating NEXTAUTH_SECRET if
// ever needed (logs out web AND mobile, a blunt but available escape
// hatch).
const TOKEN_EXPIRY = "30d";

export function signMobileToken(payload: MobileTokenPayload): string {
  return jwt.sign(payload, SECRET as string, { expiresIn: TOKEN_EXPIRY });
}

export function verifyMobileToken(token: string): MobileTokenPayload | null {
  try {
    return jwt.verify(token, SECRET as string) as MobileTokenPayload;
  } catch {
    // Covers expired, malformed, or tampered tokens — all treated the
    // same way (null = unauthenticated) rather than leaking which.
    return null;
  }
}

/**
 * Extracts and verifies a Bearer token from a request's Authorization
 * header. Returns null if missing/invalid — caller treats that as
 * unauthenticated, same as no session.
 */
export function getMobileUser(req: Request): MobileTokenPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  return verifyMobileToken(token);
}

/**
 * Unified shape both auth paths (web session, mobile token) get
 * normalized into, so route handlers can check one thing regardless of
 * which client called them.
 */
export interface AuthedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Checks for a mobile Bearer token first (cheap, no DB/session call),
 * falling back to the existing web session if absent. Use this in any
 * API route that should work from both the web app and the mobile app.
 *
 * Existing web-only routes don't need to change — they can keep using
 * getServerSession directly. Only routes the mobile app actually calls
 * need to switch to this.
 */
export async function getAuthedUser(req: Request): Promise<AuthedUser | null> {
  const mobileUser = getMobileUser(req);
  if (mobileUser) {
    return { id: mobileUser.userId, email: mobileUser.email, role: mobileUser.role };
  }

  // Lazy import to avoid pulling next-auth's server session machinery
  // into every request path when a mobile token is already present.
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("./auth");
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return { id: session.user.id, email: session.user.email, role: session.user.role };
}
