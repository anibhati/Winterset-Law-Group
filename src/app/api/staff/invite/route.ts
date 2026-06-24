import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendStaffInviteEmail } from "@/lib/email/send-staff-invite-email";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ATTORNEY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !["STAFF", "ATTORNEY"].includes(role)) {
    return NextResponse.json({ error: "Invalid email or role" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  await db.staffInviteToken.create({
    data: { email: email.toLowerCase(), role, token, expiresAt, createdById: session.user.id },
  });

  try {
    await sendStaffInviteEmail({ to: email.toLowerCase(), role, token });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send invite email:", err);
    return NextResponse.json({
      success: true,
      warning: "Invite created but email failed to send",
      inviteLink: `/accept-invite?token=${token}`,
    });
  }
}
