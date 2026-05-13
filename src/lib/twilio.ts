// Twilio client — SMS delivery for 2FA codes and payment reminders
// ⚠️  LEGAL REVIEW REQUIRED: All SMS sent under TCPA must be to consented numbers only.

import twilio from "twilio";

// Lazily initialized to avoid crashing at import when env vars aren't set (e.g., during build)
let _client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (!_client) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured.");
    }
    _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return _client;
}

export async function sendSms(to: string, body: string): Promise<void> {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) throw new Error("TWILIO_PHONE_NUMBER not configured.");

  await getClient().messages.create({ to, from, body });
}

export async function sendOtpSms(to: string, code: string): Promise<void> {
  const body = `Winterset Law Group: Your verification code is ${code}. It expires in 10 minutes. Do not share this code.`;
  await sendSms(to, body);
}

export async function sendPaymentReminder(to: string, amount: string, dueDate: string): Promise<void> {
  // Only send to users who have opted in — caller must verify SmsConsent before calling this
  const body = `WLG Reminder: A payment of ${amount} is due on ${dueDate}. Reply STOP to cancel. Msg & data rates may apply.`;
  await sendSms(to, body);
}
