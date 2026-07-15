// src/app/api/mobile/consultation/route.ts

import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getMobileUser } from "@/lib/mobile-auth";
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
    const mobileUser = await getMobileUser(req);
    if (!mobileUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.consultationBooking.findFirst({
      where: {
        userId: mobileUser.id,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        topic: true,
        preferredDate: true,
        timeSlot: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ consultation: existing ?? null });
  } catch (err) {
    console.error("[mobile/consultation GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const mobileUser = await getMobileUser(req);
    if (!mobileUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });
    }

    const { phone, topic, preferredDate, timeSlot, notes } = parsed.data;

    const debtAccount = await prisma.debtAccount.findFirst({
      where: { userId: mobileUser.id },
      select: { accountNumber: true },
    });

    const booking = await prisma.consultationBooking.create({
      data: {
        userId: mobileUser.id,
        name: mobileUser.name,
        phone,
        email: mobileUser.email,
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
        name: mobileUser.name,
        email: mobileUser.email,
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
