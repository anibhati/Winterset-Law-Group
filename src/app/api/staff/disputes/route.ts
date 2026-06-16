import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const reviewSchema = z.object({
  disputeId: z.string(),
  action: z.enum(["APPROVED", "REJECTED"]),
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

  const { disputeId, action, staffNotes } = parsed.data;

  await db.disputeRequest.update({
    where: { id: disputeId },
    data: {
      status: action,
      staffNotes: staffNotes ?? null,
    },
  });

  return NextResponse.json({ message: `Dispute ${action.toLowerCase()}.` });
}
