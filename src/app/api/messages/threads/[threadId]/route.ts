// src/app/api/messages/threads/[threadId]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch all messages in a thread
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;

    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: {
        user: { select: { id: true, name: true } },
        debtAccount: { select: { accountNumber: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Clients can only see their own threads. Role is already on the
    // JWT/session — no need to re-hit the DB for it.
    if (session.user.role === "CLIENT" && thread.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mark unread messages from OTHER senders as read
    await prisma.message.updateMany({
      where: {
        threadId,
        readAt: null,
        senderId: { not: session.user.id },
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json(thread);
  } catch (err) {
    console.error("[thread GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST — reply to a thread
export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Verify thread exists and user has access
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Role is already on the JWT/session — no need to re-hit the DB for it.
    if (session.user.role === "CLIENT" && thread.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create message and bump thread updatedAt
    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: {
          threadId,
          senderId: session.user.id,
          content: message,
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
      }),
      prisma.messageThread.update({
        where: { id: threadId },
        data: { status: "OPEN" },
      }),
    ]);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("[thread POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}