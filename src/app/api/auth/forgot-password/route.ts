// src/app/api/auth/forgot-password/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email/send-reset-email";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// Two layers: per-IP stops scripted abuse / quota burning, per-email stops
// someone repeatedly email-bombing one specific target's inbox with reset
// links from different IPs.
const IP_LIMIT = 10;
const EMAIL_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = await checkRateLimit(`forgot-password:ip:${ip}`, IP_LIMIT, WINDOW_MS);
    if (!ipLimit.success) return rateLimitResponse(ipLimit);

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailLimit = await checkRateLimit(`forgot-password:email:${normalizedEmail}`, EMAIL_LIMIT, WINDOW_MS);
    if (!emailLimit.success) {
      // Same generic success message as the "user not found" path below —
      // don't reveal that this specific email is being rate limited,
      // which would itself confirm the email exists in our system.
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success — don't reveal whether the email exists
    if (!user) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    // Invalidate any existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    // Generate token — 32 random bytes as hex
    const token = randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      token,
    });

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}