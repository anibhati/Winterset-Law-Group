import { NextRequest, NextResponse } from "next/server";
import { verifyMobileToken } from "@/lib/mobile-auth";
import { prisma as db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      debtAccount: {
        select: {
          accountNumber: true,
          debtType: true,
          originalAmount: true,
          currentBalance: true,
          agency: true,
          status: true,
          planRequests: {
            where: { status: { in: ["PENDING", "APPROVED"] } },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { status: true, frequency: true, installmentAmount: true, startDate: true },
          },
        },
      },
    },
  });

  return NextResponse.json(fullUser);
}
