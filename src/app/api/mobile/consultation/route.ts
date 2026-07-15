// src/app/api/mobile/consultation/route.ts

import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/mobile-auth";
import { syncConsultation } from "@/lib/crm/sync";

const schema = z.object({
  phone: z.string().min(7),
  topic: z.enum(["PAYMENT_PLAN", "DISPUTE", "GENERAL_INQUIRY", "OTHER"]),
  preferredDate: z.string(),
  timeSlot: z.string().min(1),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.consultationBooking.findFirst({
      where: { userId: user.id, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { createdAt: "desc" },
      select: { id: true, topic: true, preferredDate: true, timeSlot: true, status: true, createdAt: true },
    });

    return NextResponse.json({ consultation: existing ?? null });
  } catch (err) {
    console.error("[mobile/consultation GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
    }

    const { phone, topic, preferredDate, timeSlot, notes } = parsed.data;

    const [debtAccount, dbUser] = await Promise.all([
      prisma.debtAccount.findFirst({ where: { userId: user.id }, select: { accountNumber: true } }),
      prisma.user.findUnique({ where: { id: user.id }, select: { name: true } }),
    ]);

    const booking = await prisma.consultationBooking.create({
      data: {
        userId: user.id,
        name: dbUser?.name ?? "Client",
        phone,
        email: user.email,
        topic,
        accountNumber: debtAccount?.accountNumber ?? null,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes: notes ?? null,
      },
    });

    after(() =>
      syncConsultation({
        id: booking.id,
        name: dbUser?.name ?? "Client",
        email: user.email,
        phone,
        topic,
        accountNumber: debtAccount?.accountNumber ?? null,
        preferredDate: new Date(preferredDate),
        timeSlot,
        notes: notes ?? null,
      })
    );

    return NextResponse.json({ id: booking.id, message: "Consultation booked." }, { status: 201 });
  } catch (err) {
    console.error("[mobile/consultation POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
