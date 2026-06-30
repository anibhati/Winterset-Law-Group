import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/mobile-auth";

export async function GET(req: Request) {
  const user = await getAuthedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [account, dispute, consultation] = await Promise.all([
    prisma.debtAccount.findUnique({ where: { userId: user.id } }),
    prisma.disputeRequest.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.consultationBooking.findFirst({
      where: { userId: user.id, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const planRequest = account
    ? await prisma.paymentPlanRequest.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : null;

  return NextResponse.json({ account, planRequest, dispute, consultation });
}
