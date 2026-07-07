import { NextRequest, NextResponse } from "next/server";
import { verifyMobileToken } from "@/lib/mobile-auth";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const user = await verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { reason, description } = body;

  if (!reason) return NextResponse.json({ error: "A dispute reason is required." }, { status: 400 });

  const account = await db.debtAccount.findUnique({ where: { userId: user.id } });
  if (!account) return NextResponse.json({ error: "No linked account found." }, { status: 404 });

  const existing = await db.disputeRequest.findFirst({
    where: { userId: user.id, status: "PENDING" },
  });
  if (existing) return NextResponse.json({ error: "You already have a dispute under review." }, { status: 409 });

  const dispute = await db.disputeRequest.create({
    data: {
      userId: user.id,
      debtAccountId: account.id,
      reason,
      description: description ?? null,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, dispute });
}
