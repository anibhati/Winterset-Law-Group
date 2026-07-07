import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma as db } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// The invite token is 32 random bytes (infeasible to brute-force), so this
// is cheap defense-in-depth, not the primary control.
const LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

const schema = z.object({
  token: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  // Same minimum as the regular signup flow — this creates STAFF/ATTORNEY
  // accounts, which is exactly the case you do NOT want a weak password on.
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit(`accept-invite:${ip}`, LIMIT, WINDOW_MS);
  if (!rl.success) return rateLimitResponse(rl);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  const { token, name, password } = parsed.data;

  const invite = await db.staffInviteToken.findUnique({ where: { token } });
  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite is invalid or expired" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.user.create({
    data: { email: invite.email, name, password: hashed, role: invite.role },
  });

  await db.staffInviteToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}