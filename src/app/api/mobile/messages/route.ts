// src/app/api/mobile/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const threads = await prisma.messageThread.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true, senderId: true, readAt: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const threadsWithUnread = threads.map((t) => {
      const lastMsg = t.messages[0];
      const hasUnread = lastMsg && !lastMsg.readAt && lastMsg.senderId !== user.id;
      return { ...t, hasUnread };
    });

    return NextResponse.json({ threads: threadsWithUnread });
  } catch (err) {
    console.error("[mobile/messages GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, message } = await req.json();

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const debtAccount = await prisma.debtAccount.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });

    const thread = await prisma.messageThread.create({
      data: {
        userId: user.id,
        subject: subject.trim(),
        debtAccountId: debtAccount?.id ?? null,
        messages: {
          create: { senderId: user.id, content: message.trim() },
        },
      },
      include: { messages: true },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (err) {
    console.error("[mobile/messages POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
