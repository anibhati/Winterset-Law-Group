import { NextRequest, NextResponse, after } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { sendStatusEmail } from "@/lib/email/send-status-email";

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

  const dispute = await db.disputeRequest.update({
    where: { id: disputeId },
    data: { status: action, staffNotes: staffNotes ?? null },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (dispute.user) {
    await db.notification.create({
      data: {
        userId: dispute.user.id,
        title: action === "APPROVED" ? "Dispute Approved" : "Dispute Update",
        body: action === "APPROVED"
          ? "Your dispute has been approved." + (staffNotes ? ` Note: ${staffNotes}` : "")
          : "Your dispute was not approved at this time." + (staffNotes ? ` Note: ${staffNotes}` : ""),
      },
    });

    after(() =>
      sendStatusEmail({
        to: dispute.user!.email,
        name: dispute.user!.name,
        status: action,
        requestType: "dispute",
        staffNotes,
      }).catch((err) => console.error("[email] disputes status:", err))
    );
  }

  return NextResponse.json({ message: `Dispute ${action.toLowerCase()}.` });
}