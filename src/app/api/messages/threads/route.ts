// src/app/api/messages/threads/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — list threads for the current user
// Staff/attorneys see all threads; clients see only their own
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const where =
      user?.role === "CLIENT" ? { userId: session.user.id } : {};

    const threads = await prisma.messageThread.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        debtAccount: { select: { accountNumber: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            readAt: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Add unread count per thread for the current user
    const threadsWithUnread = threads.map((t) => {
      const lastMsg = t.messages[0];
      const hasUnread =
        lastMsg && !lastMsg.readAt && lastMsg.senderId !== session.user.id;
      return { ...t, hasUnread };
    });

    return NextResponse.json(threadsWithUnread);
  } catch (err) {
    console.error("[threads GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST — client creates a new thread
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, debtAccountId } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const thread = await prisma.messageThread.create({
      data: {
        userId: session.user.id,
        subject,
        debtAccountId: debtAccountId || null,
        messages: {
          create: {
            senderId: session.user.id,
            content: message,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (err) {
    console.error("[threads POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}