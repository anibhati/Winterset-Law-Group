// ⚠️ LEGAL REVIEW REQUIRED — placeholder privacy policy template

import type { Metadata } from "next";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold">Privacy Policy</h1>
          <p className="text-white/60 text-sm mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 prose prose-gray max-w-none">
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8 not-prose">
          <p className="text-amber-800 text-sm font-semibold">⚠️ Template — Legal Review Required</p>
          <p className="text-amber-700 text-xs mt-1">
            Placeholder content. Must be finalized by legal counsel, including compliance with Ohio law,
            FDCPA, TCPA, and applicable federal privacy regulations.
          </p>
        </div>

        <h2>1. Who We Are</h2>
        <p>
          {FIRM.name} (&quot;WLG,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a law firm serving as Special Counsel to
          the Ohio Attorney General&apos;s Office under ORC § 109.08. We are responsible for the processing of
          personal information you provide through this portal.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li><strong>Identity information:</strong> Name, date of birth, Social Security Number (last 4), government ID</li>
          <li><strong>Contact information:</strong> Email address, phone number, mailing address</li>
          <li><strong>Account &amp; financial information:</strong> Case number, debt balance, payment history (no raw card data stored)</li>
          <li><strong>Technical information:</strong> IP address, browser type, device identifiers, login timestamps</li>
          <li><strong>Communications:</strong> Messages sent through the contact form or secure messaging</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To manage and resolve your debt account</li>
          <li>To process payments and maintain payment plan records</li>
          <li>To communicate with you about your account (subject to your preferences)</li>
          <li>To comply with legal obligations under FDCPA, Ohio law, and AG Office requirements</li>
          <li>To protect against fraud and unauthorized account access</li>
          <li>For audit and compliance purposes</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>
          We do not sell your personal information. We may share it with:
        </p>
        <ul>
          <li>The Ohio Attorney General&apos;s Office (as required under ORC § 109.08)</li>
          <li>State agencies that certified your debt for collection</li>
          <li>SMS service providers (e.g., Twilio) for consented communications</li>
          <li>Legal authorities when required by law or court order</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We employ industry-standard security measures including encryption in transit (TLS) and at rest,
          two-factor authentication, access controls, and audit logging. However, no system is completely
          secure. Please contact us immediately if you suspect unauthorized account access.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain personal information for the period necessary to fulfill the purposes described in this
          Policy and as required by applicable law. Debt collection records are subject to Ohio record
          retention requirements. [PLACEHOLDER — specify retention periods with counsel.]
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Depending on applicable law, you may have rights to access, correct, or request deletion of your
          personal information. To exercise these rights, contact us at {FIRM.email} or {FIRM.phone}.
          Note that certain information may be retained as required by law.
        </p>

        <h2>8. SMS Communications</h2>
        <p>
          If you have opted in to SMS communications, please review our{" "}
          <a href="/legal/sms-terms">SMS Terms &amp; Privacy Policy</a> for details specific to text messaging.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about this Privacy Policy: {FIRM.email} | {FIRM.phone}
        </p>
      </div>
    </>
  );
}
