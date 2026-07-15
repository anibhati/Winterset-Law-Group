// src/app/api/mobile/messages/[threadId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthedUser } from "@/lib/mobile-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { threadId } = await params;

    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    if (thread.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.message.updateMany({
      where: { threadId, readAt: null, senderId: { not: user.id } },
      data: { readAt: new Date() },
    });

    return NextResponse.json(thread);
  } catch (err) {
    console.error("[mobile/messages/threadId GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const user = await getAuthedUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { threadId } = await params;
    const { message } = await req.json();

    if (!message?.trim()) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const thread = await prisma.messageThread.findUnique({ where: { id: threadId } });
    if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    if (thread.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: { threadId, senderId: user.id, content: message.trim() },
        include: { sender: { select: { id: true, name: true, role: true } } },
      }),
      prisma.messageThread.update({
        where: { id: threadId },
        data: { status: "OPEN", updatedAt: new Date() },
      }),
    ]);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("[mobile/messages/threadId POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
