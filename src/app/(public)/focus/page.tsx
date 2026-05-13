import type { Metadata } from "next";
import Link from "next/link";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "Our Focus" };

const debtTypes = [
  {
    title: "Personal Income Tax",
    icon: "🧾",
    desc: "Ohio personal income tax debts certified to the Attorney General's Office for collection. This includes unpaid returns, assessments, and related penalties.",
    examples: ["Unpaid annual tax liability", "Assessed deficiencies", "Penalty and interest balances"],
  },
  {
    title: "Business Tax",
    icon: "🏢",
    desc: "Business-related Ohio tax obligations including commercial activity tax, sales tax, employer withholding, and other business levies.",
    examples: ["Commercial Activity Tax (CAT)", "Sales & Use Tax", "Employer withholding obligations"],
  },
  {
    title: "Bureau of Workers' Compensation",
    icon: "🦺",
    desc: "Unpaid premiums and obligations owed to the Ohio Bureau of Workers' Compensation by employers.",
    examples: ["Unpaid BWC premiums", "Employer assessments", "Penalty balances"],
  },
  {
    title: "Unemployment Compensation",
    icon: "💼",
    desc: "Overpayment recovery and employer obligations related to Ohio unemployment compensation administered by the Ohio Department of Job and Family Services.",
    examples: ["Claimant overpayment recovery", "Employer contribution delinquencies"],
  },
  {
    title: "Medicaid",
    icon: "🏥",
    desc: "Recovery of Medicaid-related obligations as certified by the Ohio Department of Medicaid.",
    examples: ["Estate recovery", "Provider overpayments", "Medicaid eligibility fraud recoveries"],
  },
  {
    title: "Other State Collections",
    icon: "📋",
    desc: "WLG handles various other state agency claims certified to the Ohio AG's Office under ORC 109.08.",
    examples: ["Court-ordered fines and fees", "Agency-specific debt programs", "Other certified state claims"],
  },
];

export default function FocusPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gold-500 uppercase tracking-widest text-sm mb-3">What We Handle</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Focus</h1>
          <div className="h-1 w-16 bg-gold-500 rounded-full mb-6"></div>
          <p className="text-white/80 max-w-2xl leading-relaxed">
            {FIRM.name} assists Ohio residents with a range of state collection matters. Below is an overview
            of the types of debt we handle as Special Counsel to the Ohio AG&apos;s Tax Division.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {debtTypes.map(({ title, icon, desc, examples }) => (
              <div key={title} className="card hover:shadow-md transition-shadow flex flex-col">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-serif font-bold text-navy-900 text-xl mb-3">{title}</h3>
                <div className="h-0.5 w-10 bg-gold-500 mb-4"></div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{desc}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Examples include:</p>
                  <ul className="space-y-1">
                    {examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="text-gold-500 mt-0.5">•</span>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="section-title mb-4">Not Sure If We Can Help?</h2>
          <div className="gold-divider mx-auto mb-6"></div>
          <p className="text-gray-600 mb-8">
            If you&apos;ve received a notice from the Ohio Attorney General&apos;s Office or from Winterset Law Group,
            we can explain your situation clearly. Give us a call. We&apos;re here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={`tel:${FIRM.phone}`} className="btn-primary">{FIRM.phone}</a>
            <Link href="/contact" className="btn-secondary">Send a Message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
