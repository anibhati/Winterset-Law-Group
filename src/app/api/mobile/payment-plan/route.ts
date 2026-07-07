import { NextRequest, NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/mobile-auth";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await getAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { frequency, installmentAmount, startDate } = body;

  if (!frequency || !installmentAmount || installmentAmount <= 0) {
    return NextResponse.json({ error: "Frequency and a valid amount are required." }, { status: 400 });
  }

  const account = await db.debtAccount.findUnique({ where: { userId: user.id } });
  if (!account) return NextResponse.json({ error: "No linked account found." }, { status: 404 });

  const existing = await db.paymentPlanRequest.findFirst({
    where: { userId: user.id, status: "PENDING" },
  });
  if (existing) return NextResponse.json({ error: "You already have a plan under review." }, { status: 409 });

  const plan = await db.paymentPlanRequest.create({
    data: {
      userId: user.id,
      debtAccountId: account.id,
      frequency,
      installmentAmount: parseFloat(installmentAmount),
      startDate: startDate ? new Date(startDate) : new Date(),
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, plan });
}
