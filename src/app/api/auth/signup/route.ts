import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
  }

  const { name, email, phone, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    // Prevent email enumeration
    return NextResponse.json({ message: "If this email is not registered, your account has been created." }, { status: 200 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email: normalizedEmail,
      phone: phone?.replace(/\D/g, "") ?? null,
      password: hashed,
      role: "CLIENT",
    },
  });

  return NextResponse.json({ message: "Account created. Please sign in.", id: user.id }, { status: 201 });
}
