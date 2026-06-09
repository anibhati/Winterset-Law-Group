// src/lib/crm/sync.ts
// Fire-and-forget CRM sync. Call after writing to your DB.
// If the CRM is down, the row stays with crmSyncedAt = null
// and can be retried later (sweep route or cron).

import { prisma } from "@/lib/prisma";
import { crm } from "./index";
import type {
  PaymentPlanPayload,
  DisputePayload,
  ConsultationPayload,
} from "./types";

export async function syncPaymentPlan(
  plan: PaymentPlanPayload & { debtAccountId?: string }
) {
  try {
    const result = await crm.pushPaymentPlan(plan);
    if (result.ok) {
      await prisma.paymentPlanRequest.update({
        where: { id: plan.id },
        data: {
          crmRecordId: result.crmRecordId ?? null,
          crmSyncedAt: new Date(),
        },
      });
    } else {
      console.error("[CRM sync] payment plan failed:", result.error);
    }
  } catch (err) {
    console.error("[CRM sync] payment plan error:", err);
  }
}

export async function syncDispute(dispute: DisputePayload) {
  try {
    const result = await crm.pushDispute(dispute);
    if (result.ok) {
      await prisma.disputeRequest.update({
        where: { id: dispute.id },
        data: {
          crmRecordId: result.crmRecordId ?? null,
          crmSyncedAt: new Date(),
        },
      });
    } else {
      console.error("[CRM sync] dispute failed:", result.error);
    }
  } catch (err) {
    console.error("[CRM sync] dispute error:", err);
  }
}

export async function syncConsultation(booking: ConsultationPayload) {
  try {
    const result = await crm.pushConsultation(booking);
    if (result.ok) {
      await prisma.consultationBooking.update({
        where: { id: booking.id },
        data: {
          crmRecordId: result.crmRecordId ?? null,
          crmSyncedAt: new Date(),
        },
      });
    } else {
      console.error("[CRM sync] consultation failed:", result.error);
    }
  } catch (err) {
    console.error("[CRM sync] consultation error:", err);
  }
}