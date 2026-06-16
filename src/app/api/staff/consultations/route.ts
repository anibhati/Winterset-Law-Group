import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const reviewSchema = z.object({
  consultationId: z.string(),
  action: z.enum(["CONFIRMED", "CANCELLED"]),
  staffNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "STAFF" && session.user.role !== "ATTORNEY")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });

  const { consultationId, action, staffNotes } = parsed.data;

  await db.consultationBooking.update({
    where: { id: consultationId },
    data: {
      status: action,
      confirmedBy: action === "CONFIRMED" ? (session.user.name || session.user.email) : null,
      staffNotes: staffNotes ?? null,
    },
  });

  return NextResponse.json({ message: `Consultation ${action.toLowerCase()}.` });
}
