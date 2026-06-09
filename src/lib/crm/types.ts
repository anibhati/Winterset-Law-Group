// src/lib/crm/types.ts
// Defines what your app needs from the CRM — in YOUR terms, not the CRM's.
// When the real CRM is known, only the adapter implementation changes.

export interface CrmAdapter {
  // Outbound: debtor-initiated actions pushed to the CRM
  pushPaymentPlan(payload: PaymentPlanPayload): Promise<CrmSyncResult>;
  pushDispute(payload: DisputePayload): Promise<CrmSyncResult>;
  pushConsultation(payload: ConsultationPayload): Promise<CrmSyncResult>;

  // Inbound: account data the CRM owns (optional — only if the firm
  // wants the CRM as source-of-truth for accounts)
  fetchAccountByNumber?(accountNumber: string): Promise<CrmAccount | null>;
}

// ── Outbound payloads ──────────────────────────────────────────────

export interface PaymentPlanPayload {
  id: string;
  accountNumber: string;
  debtorName: string;
  frequency: string;
  installmentAmount: number;
  startDate: Date;
}

export interface DisputePayload {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  description: string;
}

export interface ConsultationPayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  accountNumber: string | null;
  preferredDate: Date;
  timeSlot: string;
  notes: string | null;
}

// ── Sync result ────────────────────────────────────────────────────

export interface CrmSyncResult {
  ok: boolean;
  crmRecordId?: string; // store on your row for reconciliation
  error?: string;
}

// ── Inbound shape (if pulling accounts from CRM) ──────────────────

export interface CrmAccount {
  accountNumber: string;
  debtorName: string;
  last4Ssn: string;
  debtType: string;
  originalAmount: number;
  currentBalance: number;
  agency: string;
  status: string;
}