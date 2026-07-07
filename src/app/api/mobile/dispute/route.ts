import { NextRequest, NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/mobile-auth";
import { prisma as db } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const authedUser = await getAuthedUser(req);
  if (!authedUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { reason, description } = body;

  if (!reason) return NextResponse.json({ error: "A dispute reason is required." }, { status: 400 });
  if (!description || !description.trim()) {
    return NextResponse.json({ error: "A description is required." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: authedUser.id } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const account = await db.debtAccount.findUnique({ where: { userId: authedUser.id } });
  if (!account) return NextResponse.json({ error: "No linked account found." }, { status: 404 });

  const existing = await db.disputeRequest.findFirst({
    where: { userId: authedUser.id, status: "PENDING" },
  });
  if (existing) return NextResponse.json({ error: "You already have a dispute under review." }, { status: 409 });

  const dispute = await db.disputeRequest.create({
    data: {
      userId: authedUser.id,
      accountNumber: account.accountNumber,
      name: user.name ?? "",
      email: user.email,
      phone: user.phone ?? "",
      reason,
      description: description.trim(),
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, dispute });
}
