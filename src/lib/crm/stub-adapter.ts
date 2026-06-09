// src/lib/crm/stub-adapter.ts
// No-op adapter for development. Logs calls, returns success.
// Replace with real-adapter.ts once the CRM is known.

import { CrmAdapter, CrmSyncResult } from "./types";

export const stubCrm: CrmAdapter = {
  async pushPaymentPlan(payload) {
    console.log("[CRM stub] pushPaymentPlan", payload.id, payload.accountNumber);
    return success();
  },

  async pushDispute(payload) {
    console.log("[CRM stub] pushDispute", payload.id, payload.accountNumber);
    return success();
  },

  async pushConsultation(payload) {
    console.log("[CRM stub] pushConsultation", payload.id, payload.email);
    return success();
  },
};

function success(): CrmSyncResult {
  return { ok: true, crmRecordId: `stub-${Date.now()}` };
}