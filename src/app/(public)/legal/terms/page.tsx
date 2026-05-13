// ⚠️ LEGAL REVIEW REQUIRED before going live.
// This is a template — have qualified legal counsel review and finalize all terms.

import type { Metadata } from "next";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold">Terms &amp; Conditions</h1>
          <p className="text-white/60 text-sm mt-2">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 prose prose-gray max-w-none">
        {/* ⚠️ PLACEHOLDER — MUST BE REVIEWED BY LEGAL COUNSEL */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8 not-prose">
          <p className="text-amber-800 text-sm font-semibold">⚠️ Template — Legal Review Required</p>
          <p className="text-amber-700 text-xs mt-1">
            This is placeholder content. All terms must be reviewed and finalized by qualified legal counsel
            before this application goes live, particularly FDCPA, TCPA, and Ohio-specific compliance requirements.
          </p>
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the {FIRM.name} client portal (&quot;Service&quot;), you agree to be bound by these
          Terms and Conditions. If you do not agree, do not use the Service.
        </p>

        <h2>2. Debt Collection Notice</h2>
        <p>
          {FIRM.name} is a debt collector. This is an attempt to collect a debt, and any information
          obtained will be used for that purpose. {FIRM.name} acts as Special Counsel to the Ohio
          Attorney General&apos;s Office pursuant to Ohio Revised Code § 109.08.
        </p>

        <h2>3. Account Access</h2>
        <p>
          Access to the portal requires account registration and identity verification. You are responsible
          for maintaining the security of your account credentials. You must enable two-factor authentication
          as a condition of use.
        </p>

        <h2>4. Payments</h2>
        <p>
          All payments made through this portal are processed by a PCI-compliant third-party payment processor.
          {FIRM.name} does not store your full payment card information. Payment receipts will be issued
          electronically. Payments are applied to outstanding balances per applicable law.
        </p>

        <h2>5. Payment Plans</h2>
        <p>
          Payment plans offered through this portal are subject to approval and may be modified or terminated
          in accordance with applicable Ohio law and the terms of any written agreement. Failure to make timely
          payments may result in termination of the plan and additional enforcement action.
        </p>

        <h2>6. Accuracy of Information</h2>
        <p>
          You agree to provide accurate and complete information when creating an account or making inquiries.
          Providing false information may be a violation of applicable law.
        </p>

        <h2>7. Privacy</h2>
        <p>
          Your use of this Service is also governed by our Privacy Policy, which is incorporated by reference
          into these Terms.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          [PLACEHOLDER — TO BE DRAFTED BY LEGAL COUNSEL] {FIRM.name}&apos;s liability in connection with
          this Service is limited to the extent permitted by applicable law.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Ohio, without regard to conflict of law principles.
          Any disputes shall be resolved in the courts of [County], Ohio.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          {FIRM.name} reserves the right to modify these Terms at any time. Continued use of the Service
          after changes constitutes acceptance of the revised Terms.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about these Terms may be directed to: {FIRM.email} or {FIRM.phone}.
        </p>
      </div>
    </>
  );
}
