import type { Metadata } from "next";
import Link from "next/link";
import { FIRM } from "@/lib/constants";

export const metadata: Metadata = { title: "Our Focus" };

// Inline SVG icons (line-style, inherit currentColor)
const Icon = {
  Tax: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Business: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Workers: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Unemployment: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Medical: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Document: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2zM9 7h6v.01" />
    </svg>
  ),
};

const debtTypes = [
  {
    title: "Personal Income Tax",
    icon: Icon.Tax,
    desc: "Ohio personal income tax debts certified to the Attorney General's Office for collection, including unpaid returns, assessments, and related penalties.",
    examples: ["Unpaid annual tax liability", "Assessed deficiencies", "Penalty and interest balances"],
  },
  {
    title: "Business Tax",
    icon: Icon.Business,
    desc: "Business-related Ohio tax obligations, including commercial activity tax, sales tax, employer withholding, and other business levies.",
    examples: ["Commercial Activity Tax (CAT)", "Sales and Use Tax", "Employer withholding obligations"],
  },
  {
    title: "Bureau of Workers' Compensation",
    icon: Icon.Workers,
    desc: "Unpaid premiums and obligations owed to the Ohio Bureau of Workers' Compensation by employers.",
    examples: ["Unpaid BWC premiums", "Employer assessments", "Penalty balances"],
  },
  {
    title: "Unemployment Compensation",
    icon: Icon.Unemployment,
    desc: "Overpayment recovery and employer obligations related to Ohio unemployment compensation, administered by the Ohio Department of Job and Family Services.",
    examples: ["Claimant overpayment recovery", "Employer contribution delinquencies"],
  },
  {
    title: "Medicaid",
    icon: Icon.Medical,
    desc: "Recovery of Medicaid-related obligations as certified by the Ohio Department of Medicaid.",
    examples: ["Estate recovery", "Provider overpayments", "Medicaid eligibility fraud recoveries"],
  },
  {
    title: "Other State Collections",
    icon: Icon.Document,
    desc: "Various other state agency claims certified to the Ohio Attorney General's Office under Ohio Revised Code 109.08.",
    examples: ["Court-ordered fines and fees", "Agency-specific debt programs", "Other certified state claims"],
  },
];

export default function FocusPage() {
  return (
    <>
      <section className="bg-navy-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gold-500 uppercase tracking-[0.2em] text-xs mb-3">What We Handle</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Focus</h1>
          <div className="h-0.5 w-16 bg-gold-500 rounded-full mb-6"></div>
          <p className="text-white/80 max-w-2xl leading-relaxed">
            {FIRM.name} assists Ohio residents with a range of state collection matters. Below is an overview
            of the types of debt we handle as Special Counsel to the Ohio Attorney General&apos;s Tax Division.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {debtTypes.map(({ title, icon, desc, examples }) => (
              <div key={title} className="card flex flex-col">
                <div className="text-gold-500 mb-5">{icon}</div>
                <h3 className="font-serif font-bold text-navy-900 text-xl mb-3">{title}</h3>
                <div className="h-0.5 w-10 bg-gold-500 mb-4"></div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-2">Examples</p>
                  <ul className="space-y-1.5">
                    {examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-gold-500 mt-1 leading-none">•</span>
                        <span>{ex}</span>
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
          <p className="text-gray-600 leading-relaxed mb-8">
            If you have received a notice from the Ohio Attorney General&apos;s Office or from Winterset Law Group,
            we can explain your situation clearly. Call our office to speak with a member of our team.
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