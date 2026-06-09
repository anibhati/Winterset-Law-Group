// src/lib/crm/api-adapter.ts
// Real CRM adapter using REST API. Replaces stub when env vars are set.

import type {
  CrmAdapter,
  CrmSyncResult,
  PaymentPlanPayload,
  DisputePayload,
  ConsultationPayload,
} from "./types";

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "";
const CRM_API_KEY = process.env.CRM_API_KEY ?? "";

async function crmRequest(endpoint: string, body: object): Promise<Record<string, unknown> | null> {
  if (!CRM_BASE_URL || !CRM_API_KEY) return null;

  try {
    const res = await fetch(`${CRM_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CRM_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(`[CRM] Request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("[CRM] Request error:", err);
    return null;
  }
}

function toResult(response: Record<string, unknown> | null): CrmSyncResult {
  if (!response) return { ok: false, error: "CRM request failed or disabled" };
  return {
    ok: true,
    crmRecordId: (response.id as string) ?? (response.caseId as string) ?? undefined,
  };
}

export const apiCrm: CrmAdapter = {
  async pushPaymentPlan(p: PaymentPlanPayload) {
    const res = await crmRequest("/cases", {
      type: "PAYMENT_PLAN",
      priority: "normal",
      clientName: p.debtorName,
      debtType: "", // filled in when we have it
      proposedAmount: p.installmentAmount,
      frequency: p.frequency,
    });
    return toResult(res);
  },

  async pushDispute(d: DisputePayload) {
    const res = await crmRequest("/cases", {
      type: "DISPUTE",
      priority: "high",
      clientEmail: d.email,
      clientName: d.name,
      reason: d.reason,
      details: d.description,
    });
    return toResult(res);
  },

  async pushConsultation(c: ConsultationPayload) {
    const res = await crmRequest("/consultations", {
      clientEmail: c.email,
      clientName: c.name,
      date: c.preferredDate.toISOString().split("T")[0],
      time: c.timeSlot,
    });
    return toResult(res);
  },
};

// Bonus: contact creation on signup (from your old file)
export async function crmCreateContact(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  return crmRequest("/contacts", data);
}