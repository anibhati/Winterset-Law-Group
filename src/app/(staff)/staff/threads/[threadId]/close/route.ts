// src/app/api/staff/threads/[threadId]/close/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Role is already on the JWT/session — no need to re-hit the DB for it.
  if (session.user.role === "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { threadId } = await params;

  const thread = await prisma.messageThread.update({
    where: { id: threadId },
    data: { status: "CLOSED" },
  });

  return NextResponse.json(thread);
}