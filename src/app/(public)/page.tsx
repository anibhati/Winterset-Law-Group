import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <section className="bg-navy-900 text-white min-h-[88vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gold-400 uppercase tracking-[0.2em] text-xs font-semibold mb-4">
          Special Counsel to the Ohio Attorney General
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4 max-w-2xl">
          Resolve Your Ohio State Debt Online
        </h1>
        <p className="text-white/70 text-base mb-10 max-w-md leading-relaxed">
          Set up a payment plan, file a dispute, or schedule a call with an attorney. No office visit required.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link href="/login" className="flex-1 bg-gold-500 hover:bg-gold-600 text-white font-bold text-base px-6 py-4 rounded-xl transition-colors text-center shadow-lg">
            Sign In
          </Link>
          <Link href="/signup" className="flex-1 border-2 border-white/30 hover:border-white text-white font-semibold text-base px-6 py-4 rounded-xl transition-colors text-center">
            Create Account
          </Link>
        </div>

        <a href={`tel:${FIRM.phone}`} className="mt-8 inline-flex items-center gap-2 text-white/80 hover:text-gold-400 text-base font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          Call {FIRM.phone}
        </a>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-gold-400 mb-3 flex justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-white text-xs font-semibold mb-1">Payment Plans</p>
            <p className="text-white/50 text-xs leading-snug">Weekly, biweekly, or monthly</p>
          </div>
          <div className="text-center">
            <div className="text-gold-400 mb-3 flex justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p className="text-white text-xs font-semibold mb-1">File a Dispute</p>
            <p className="text-white/50 text-xs leading-snug">Contest an incorrect debt</p>
          </div>
          <div className="text-center">
            <div className="text-gold-400 mb-3 flex justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m-2-9l4 4V5a2 2 0 012-2h7a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4V5z"></path>
              </svg>
            </div>
            <p className="text-white text-xs font-semibold mb-1">Speak with Counsel</p>
            <p className="text-white/50 text-xs leading-snug">Direct attorney access</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-serif font-bold text-navy-900">{new Date().getFullYear() - FIRM.servingSince}+</p>
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mt-2">Years Serving Ohio</p>
            </div>
            <div className="md:border-x border-gray-100">
              <p className="text-3xl font-serif font-bold text-navy-900">ORC 109.08</p>
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mt-2">Statutory Authority</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-navy-900">Powell, Ohio</p>
              <p className="text-xs uppercase tracking-[0.15em] text-gray-500 mt-2">Office Location</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-100 py-4 px-4 text-center">
        <p className="text-gray-500 text-xs max-w-3xl mx-auto">{DISCLOSURES.debtCollection}</p>
      </div>
    </>
  );
}