// src/app/api/notifications/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — client fetches their notifications
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("[notifications GET]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST — staff sends a notification to a client
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only staff/attorneys can send notifications
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (sender?.role === "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, title, body } = await req.json();

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: "userId, title, and body are required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: { userId, title, body },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (err) {
    console.error("[notifications POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}