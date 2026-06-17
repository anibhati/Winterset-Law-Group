import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendStatusEmail } from "@/lib/email/send-status-email";

const reviewSchema = z.object({
  planId: z.string(),
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

  const { planId, action, staffNotes } = parsed.data;

  const plan = await db.paymentPlanRequest.update({
    where: { id: planId },
    data: {
      status: action,
      staffNotes: staffNotes ?? null,
      reviewedBy: session.user.name || session.user.email,
      reviewedAt: new Date(),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (action === "APPROVED") {
    await db.debtAccount.update({
      where: { id: plan.debtAccountId },
      data: { status: "IN_PLAN" },
    });
  }

  if (plan.user) {
    await db.notification.create({
      data: {
        userId: plan.user.id,
        title: action === "APPROVED" ? "Payment Plan Approved" : "Payment Plan Update",
        body: action === "APPROVED"
          ? "Your payment plan has been approved." + (staffNotes ? ` Note: ${staffNotes}` : "")
          : "Your payment plan was not approved at this time." + (staffNotes ? ` Note: ${staffNotes}` : ""),
      },
    });

    sendStatusEmail({
      to: plan.user.email,
      name: plan.user.name,
      status: action,
      requestType: "payment plan",
      staffNotes,
    }).catch((err) => console.error("[email] plans status:", err));
  }

  return NextResponse.json({ message: `Plan ${action.toLowerCase()}.` });
}
