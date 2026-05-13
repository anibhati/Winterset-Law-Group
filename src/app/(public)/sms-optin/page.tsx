import type { Metadata } from "next";
import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export const metadata: Metadata = { title: "SMS Updates" };

export default function SmsOptInPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gold-500 uppercase tracking-widest text-sm mb-3">Stay Connected</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">SMS Text Updates</h1>
          <div className="h-1 w-16 bg-gold-500 rounded-full"></div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* How to opt in */}
        <section className="card">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">How to Opt In</h2>
          <div className="gold-divider mb-6"></div>
          <div className="bg-navy-900 rounded-xl p-8 text-center mb-6">
            <p className="text-white/70 text-sm mb-2">Send a text message with the word</p>
            <p className="text-gold-400 font-serif font-bold text-5xl mb-2">{FIRM.smsKeyword}</p>
            <p className="text-white/70 text-sm">to</p>
            <p className="text-white font-bold text-3xl mt-2">{FIRM.smsNumber}</p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Once opted in, you may receive text messages from Winterset Law Group regarding your account,
            including payment reminders, case updates, and important notices.
          </p>
        </section>

        {/* Required TCPA Disclosure — verbatim, must not be modified without legal review */}
        <section className="card border-2 border-gold-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gold-500 text-xl">⚠️</span>
            <h2 className="text-lg font-bold text-navy-900">Required SMS Disclosure</h2>
          </div>
          {/* ⚠️ LEGAL REVIEW: This disclosure is TCPA-mandated. Do not alter wording without legal counsel. */}
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {DISCLOSURES.smsOptIn}
          </p>
        </section>

        {/* Managing your subscription */}
        <section className="card">
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-4">Managing Your Subscription</h2>
          <div className="space-y-4">
            {[
              { keyword: "STOP", desc: "Opt out of all text messages from WLG. You will receive one confirmation message and then no further texts." },
              { keyword: "HELP", desc: "Receive assistance information including contact details for WLG." },
              { keyword: "JOIN", desc: "Re-subscribe after opting out." },
            ].map(({ keyword, desc }) => (
              <div key={keyword} className="flex items-start gap-4">
                <span className="bg-navy-900 text-white font-bold text-sm px-3 py-1 rounded font-mono flex-shrink-0">
                  {keyword}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rates & Frequency */}
        <section className="card">
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-4">Message Frequency &amp; Rates</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gold-500">•</span>
              Message frequency varies based on your account activity and payment schedule.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500">•</span>
              Standard message and data rates may apply depending on your mobile carrier and plan.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-500">•</span>
              WLG does not charge for text messages, but your carrier may.
            </li>
          </ul>
        </section>

        {/* Links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/legal/sms-terms" className="text-navy-900 font-medium hover:text-gold-600 underline underline-offset-2">
            Full SMS Terms &amp; Conditions
          </Link>
          <Link href="/legal/privacy" className="text-navy-900 font-medium hover:text-gold-600 underline underline-offset-2">
            Privacy Policy
          </Link>
          <a href={`tel:${FIRM.phone}`} className="text-navy-900 font-medium hover:text-gold-600 underline underline-offset-2">
            Call for Help: {FIRM.phone}
          </a>
        </div>
      </div>
    </>
  );
}
