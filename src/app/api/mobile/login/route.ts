// src/app/api/mobile/login/route.ts
//
// Mobile equivalent of the NextAuth credentials login. Returns a JWT
// in the response body instead of setting a cookie, since mobile apps
// authenticate via Authorization header, not browser cookies.

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signMobileToken } from "@/lib/mobile-auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const LOGIN_LIMIT_PER_EMAIL = 8;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_LIMIT_PER_IP = 20;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const ip = getClientIp(req);

    const [emailLimit, ipLimit] = await Promise.all([
      checkRateLimit(`mobile-login:email:${normalizedEmail}`, LOGIN_LIMIT_PER_EMAIL, LOGIN_WINDOW_MS),
      checkRateLimit(`mobile-login:ip:${ip}`, LOGIN_LIMIT_PER_IP, LOGIN_WINDOW_MS),
    ]);

    if (!emailLimit.success || !ipLimit.success) {
      // Generic message — same reasoning as the web login: don't reveal
      // that rate limiting specifically is what blocked this attempt.
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signMobileToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[mobile login]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
