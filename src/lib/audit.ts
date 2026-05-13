import { db } from "./db";
import { headers } from "next/headers";

interface AuditParams {
  userId?: string;
  action: string;
  metadata?: Record<string, unknown>;
}

export async function auditLog(params: AuditParams): Promise<void> {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";

    await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        ip,
        metadata: params.metadata as object ?? null,
      },
    });
  } catch {
    // Audit logging must never crash the main request
  }
}
