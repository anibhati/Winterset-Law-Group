// Stripe client — PCI-compliant payment processing
// Raw card data NEVER touches our servers; all sensitive data handled by Stripe Elements

import Stripe from "stripe";

// Singleton to avoid re-instantiation
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY not configured.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

/** Create a PaymentIntent for a given amount (in cents) */
export async function createPaymentIntent(
  amountCents: number,
  metadata: { userId: string; debtAccountId: string; caseNumber: string }
): Promise<Stripe.PaymentIntent> {
  return getStripe().paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata,
    description: `Winterset Law Group — Case ${metadata.caseNumber}`,
  });
}

/** Retrieve a PaymentIntent (used in webhook verification) */
export async function retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
  return getStripe().paymentIntents.retrieve(id);
}

/** Construct a Stripe webhook event (verifies signature) */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not configured.");
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}
