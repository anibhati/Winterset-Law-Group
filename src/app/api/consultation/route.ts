import { NextRequest, NextResponse, after } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { syncConsultation } from "@/lib/crm/sync";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// This form does NOT require login (session is optional below), so it's
// the most exposed public endpoint in the app for spam/bot abuse — limit
// tightly. 5 bookings per hour per IP is generous for a real person
// booking a consultation, but blocks naive scripted spam.
const CONSULTATION_LIMIT = 5;
const CONSULTATION_WINDOW_MS = 60 * 60 * 1000;

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  topic: z.enum(["PAYMENT_PLAN", "DISPUTE", "GENERAL_INQUIRY", "OTHER"]),
  accountNumber: z.string().optional(),
  preferredDate: z.string(),
  timeSlot: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await checkRateLimit(`consultation:${ip}`, CONSULTATION_LIMIT, CONSULTATION_WINDOW_MS);
  if (!rl.success) return rateLimitResponse(rl);

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });

  const session = await getServerSession(authOptions);
  const { name, phone, email, topic, accountNumber, preferredDate, timeSlot, notes } = parsed.data;

  const booking = await db.consultationBooking.create({
    data: {
      userId: session?.user?.id ?? null,
      name,
      phone,
      email,
      topic,
      accountNumber: accountNumber ?? null,
      preferredDate: new Date(preferredDate),
      timeSlot,
      notes: notes ?? null,
    },
  });

  // Wrapped in after() so Vercel keeps this function alive long enough
  // for the CRM sync to finish, instead of freezing the runtime the
  // moment the response below is sent.
  after(() =>
    syncConsultation({
      id: booking.id,
      name,
      email,
      phone,
      topic,
      accountNumber: accountNumber ?? null,
      preferredDate: new Date(preferredDate),
      timeSlot,
      notes: notes ?? null,
    })
  );

  return NextResponse.json({ id: booking.id, message: "Consultation booked." }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "STAFF" && session.user.role !== "ATTORNEY")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const bookings = await db.consultationBooking.findMany({
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
    orderBy: { preferredDate: "asc" },
  });

  return NextResponse.json(bookings);
}