import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { token, name, password } = await req.json();
  if (!token || !name || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

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