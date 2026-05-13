import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const submitSchema = z.object({
  debtAccountId: z.string(),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  installmentAmount: z.number().min(25),
  startDate: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });

  const { debtAccountId, frequency, installmentAmount, startDate } = parsed.data;

  const plan = await db.paymentPlanRequest.create({
    data: {
      userId: session.user.id,
      debtAccountId,
      frequency,
      installmentAmount,
      startDate: new Date(startDate),
    },
  });

  return NextResponse.json({ id: plan.id, message: "Payment plan request submitted." }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "STAFF" && session.user.role !== "ATTORNEY")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const plans = await db.paymentPlanRequest.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { name: true, email: true, phone: true } }, debtAccount: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}
