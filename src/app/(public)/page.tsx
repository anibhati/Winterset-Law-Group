import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero — full viewport, action focused */}
      <section className="bg-navy-900 text-white min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gold-400 uppercase tracking-widest text-xs font-semibold mb-4">
          Special Counsel · Ohio Attorney General
        </p>
        <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4 max-w-2xl">
          Resolve Your Ohio State Debt Online
        </h1>
        <p className="text-white/60 text-base mb-10 max-w-md">
          Set up a payment plan, file a dispute, or talk to an attorney — no office visit required.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/login"
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-white font-bold text-base px-6 py-4 rounded-xl transition-colors text-center shadow-lg"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex-1 border-2 border-white/30 hover:border-white text-white font-semibold text-base px-6 py-4 rounded-xl transition-colors text-center"
          >
            Create Account
          </Link>
        </div>

        <a href={`tel:${FIRM.phone}`} className="mt-6 text-white/40 hover:text-white/70 text-sm transition-colors">
          Prefer to call? {FIRM.phone}
        </a>

        {/* Three pillars */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg w-full border-t border-white/10 pt-10">
          {[
            { label: "Payment Plans", sub: "Weekly, biweekly, or monthly" },
            { label: "File a Dispute", sub: "Contest incorrect debt" },
            { label: "Talk to an Attorney", sub: "Real people, no chatbots" },
          ].map(({ label, sub }) => (
            <div key={label} className="text-center">
              <p className="text-white text-xs font-semibold mb-1">{label}</p>
              <p className="text-white/40 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclosure — required by law */}
      <div className="bg-gray-100 py-4 px-4 text-center">
        <p className="text-gray-400 text-xs max-w-3xl mx-auto">{DISCLOSURES.debtCollection}</p>
      </div>
    </>
  );
}