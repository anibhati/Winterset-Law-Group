// src/app/api/messages/threads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

// GET — list threads for the current user
// Staff/attorneys see all threads; clients see only their own
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
    );

    // Role is already on the JWT/session — no need to re-hit the DB for it.
    const where =
      session.user.role === "CLIENT" ? { userId: session.user.id } : {};

    const [threads, total] = await Promise.all([
      prisma.messageThread.findMany({
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
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.messageThread.count({ where }),
    ]);

    // Add unread count per thread for the current user
    const threadsWithUnread = threads.map((t) => {
      const lastMsg = t.messages[0];
      const hasUnread =
        lastMsg && !lastMsg.readAt && lastMsg.senderId !== session.user.id;
      return { ...t, hasUnread };
    });

    return NextResponse.json({
      threads: threadsWithUnread,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("[threads GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 20 new threads per hour per IP — authenticated already, so this is just
// defense-in-depth against one compromised/scripted account spamming
// threads, not the primary control.
const NEW_THREAD_LIMIT = 20;
const NEW_THREAD_WINDOW_MS = 60 * 60 * 1000;

// POST — client creates a new thread
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIp(req);
    const rl = await checkRateLimit(`new-thread:${ip}`, NEW_THREAD_LIMIT, NEW_THREAD_WINDOW_MS);
    if (!rl.success) return rateLimitResponse(rl);

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