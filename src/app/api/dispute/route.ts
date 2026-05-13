import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  accountNumber: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  reason: z.enum(["WRONG_AMOUNT", "ALREADY_PAID", "NOT_MY_DEBT", "IDENTITY_THEFT", "OTHER"]),
  description: z.string().min(10),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 422 });

  const session = await getServerSession(authOptions);
  const { accountNumber, name, email, phone, reason, description } = parsed.data;

  const dispute = await db.disputeRequest.create({
    data: {
      userId: session?.user?.id ?? null,
      accountNumber,
      name,
      email,
      phone,
      reason,
      description,
    },
  });

  return NextResponse.json({ id: dispute.id, message: "Dispute filed." }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "STAFF" && session.user.role !== "ATTORNEY")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const disputes = await db.disputeRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(disputes);
}
