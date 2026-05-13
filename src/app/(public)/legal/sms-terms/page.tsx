// ⚠️ LEGAL REVIEW REQUIRED — TCPA SMS Terms — do not alter disclosure language without counsel

import type { Metadata } from "next";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export const metadata: Metadata = { title: "SMS Terms & Privacy Policy" };

export default function SmsTermsPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold">SMS Terms &amp; Privacy Policy</h1>
          <p className="text-white/60 text-sm mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 prose prose-gray max-w-none">
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8 not-prose">
          <p className="text-amber-800 text-sm font-semibold">⚠️ TCPA Compliance — Legal Review Required</p>
          <p className="text-amber-700 text-xs mt-1">
            SMS terms must comply with TCPA and carrier requirements. Do not alter required disclosure language
            without legal counsel review.
          </p>
        </div>

        {/* Required TCPA disclosure — verbatim */}
        <div className="not-prose card border-2 border-navy-900 mb-8">
          <h2 className="text-lg font-bold text-navy-900 mb-3">Required Disclosure</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{DISCLOSURES.smsOptIn}</p>
        </div>

        <h2>Program Description</h2>
        <p>
          {FIRM.name} operates an SMS messaging program to send account-related communications to opted-in users,
          including payment reminders, account updates, and important notices regarding your Ohio state debt account.
        </p>

        <h2>How to Opt In</h2>
        <p>
          Text the keyword <strong>{FIRM.smsKeyword}</strong> to <strong>{FIRM.smsNumber}</strong> from your mobile
          phone. You will receive a confirmation message after successfully opting in.
        </p>

        <h2>How to Opt Out</h2>
        <p>
          Text <strong>STOP</strong> to {FIRM.smsNumber} at any time to cancel. After sending STOP, you will
          receive one additional message confirming your opt-out. You will not receive any further messages unless
          you re-subscribe.
        </p>

        <h2>Help</h2>
        <p>
          Text <strong>HELP</strong> to {FIRM.smsNumber} for help. You may also contact us at {FIRM.phone} or{" "}
          {FIRM.email}.
        </p>

        <h2>Message Frequency</h2>
        <p>
          Message frequency varies. You may receive messages related to upcoming payment due dates, confirmed
          payments, payment plan updates, and account changes.
        </p>

        <h2>Costs</h2>
        <p>
          {FIRM.name} does not charge for SMS messages. However, message and data rates may apply depending
          on your mobile carrier and plan. Contact your carrier for details.
        </p>

        <h2>Supported Carriers</h2>
        <p>
          [PLACEHOLDER — List supported carriers. Typically: AT&amp;T, Verizon, T-Mobile, Sprint, Boost,
          Cricket, MetroPCS, U.S. Cellular, and others. Confirm with your SMS provider/Twilio.]
        </p>

        <h2>Privacy</h2>
        <p>
          Your mobile number and consent data are used solely to deliver the SMS program described above.
          We do not share, rent, or sell your mobile number to third parties for marketing purposes.
          For full details, see our <a href="/legal/privacy">Privacy Policy</a>.
        </p>

        <h2>Contact</h2>
        <p>
          {FIRM.name} | {FIRM.phone} | {FIRM.email}
        </p>
      </div>
    </>
  );
}
