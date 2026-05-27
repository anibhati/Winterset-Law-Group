// CRM Integration Service
// API credentials and base URL to be configured after Wednesday's meeting

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "";
const CRM_API_KEY = process.env.CRM_API_KEY ?? "";

if (!CRM_BASE_URL || !CRM_API_KEY) {
  console.warn("[CRM] Missing CRM_BASE_URL or CRM_API_KEY — integration disabled");
}

async function crmRequest(endpoint: string, body: object) {
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

// Called when a new client signs up
export async function crmCreateContact(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  return crmRequest("/contacts", data);
}

// Called when a client submits a payment plan request
export async function crmCreatePaymentPlanCase(data: {
  clientEmail: string;
  clientName: string;
  debtType: string;
  proposedAmount: number;
  frequency: string;
}) {
  return crmRequest("/cases", {
    type: "PAYMENT_PLAN",
    priority: "normal",
    ...data,
  });
}

// Called when a client files a dispute
export async function crmCreateDisputeCase(data: {
  clientEmail: string;
  clientName: string;
  reason: string;
  details: string;
}) {
  return crmRequest("/cases", {
    type: "DISPUTE",
    priority: "high",
    ...data,
  });
}

// Called when a client schedules a consultation
export async function crmCreateConsultation(data: {
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
}) {
  return crmRequest("/consultations", data);
}