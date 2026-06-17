import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call {FIRM.phone}
        </a>

        <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
          {[
            { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Payment Plans", desc: "Weekly, biweekly, or monthly" },
            { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "File a Dispute", desc: "Contest an incorrect debt" },
            { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Speak with Counsel", desc: "Direct attorney access" },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="text-gold-400 mb-3 flex justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <p className="text-white text-xs font-semibold mb-1">{title}</p>
              <p className="text-white/50 text-xs leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-sm text-center mb-12">Resolve your debt in three simple steps — entirely online.</p>

          <div className="space-y-8">
            {[
              { step: "1", title: "Create Your Account", desc: "Sign up with your email and verify your identity using your account number and the last four digits of your SSN." },
              { step: "2", title: "Choose Your Path", desc: "Set up a payment plan that fits your budget, file a dispute if something is incorrect, or schedule a call with an attorney for guidance." },
              { step: "3", title: "Get a Response", desc: "Our team reviews every request within 1-2 business days. You'll receive an email and in-app notification with the outcome." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5 items-start">
                <div className="w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/signup" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors inline-block">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
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

      {/* Your Rights */}
      <section className="bg-white py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 text-center mb-2">Your Rights Matter</h2>
          <p className="text-gray-500 text-sm text-center mb-12">We operate under Ohio and federal law. You have rights — and we respect them.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Right to Dispute", desc: "You can challenge any debt you believe is inaccurate or not yours. We'll investigate within 30 days." },
              { title: "Right to Verification", desc: "Request written verification of any debt. We are required by law to provide it." },
              { title: "Right to an Attorney", desc: "You may consult with an attorney at any time. Our team is available to discuss your case directly." },
              { title: "Right to Fair Treatment", desc: "We follow the Fair Debt Collection Practices Act (FDCPA) and all applicable Ohio statutes." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-semibold text-navy-900 text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4 border-t border-gray-100">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-sm text-center mb-12">Quick answers to common questions about managing your account.</p>

          <div className="space-y-4">
            {[
              { q: "What do I need to create an account?", a: "Your account number from the letter you received, your last name, and the last four digits of your Social Security Number." },
              { q: "How quickly will my payment plan be reviewed?", a: "Our team reviews all submissions within 1-2 business days. You'll receive an email and in-app notification with the decision." },
              { q: "Can I dispute a debt I don't recognize?", a: "Yes. You have the legal right to dispute any debt. File a dispute through your account and our team will investigate." },
              { q: "Is my information secure?", a: "Yes. All data is encrypted with 256-bit TLS encryption. We follow HIPAA-grade security practices and never share your information." },
              { q: "Can I talk to someone on the phone?", a: `Absolutely. Call us at ${FIRM.phone} during business hours (${FIRM.hours}) or schedule a call through the app.` },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-navy-900 text-sm mb-2">{q}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-900 py-16 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">Ready to Resolve Your Debt?</h2>
        <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">Create your account today and take the first step toward resolving your Ohio state debt — from anywhere, anytime.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <Link href="/signup" className="flex-1 bg-gold-500 hover:bg-gold-600 text-white font-bold text-base px-6 py-4 rounded-xl transition-colors text-center shadow-lg">
            Create Account
          </Link>
          <a href={`tel:${FIRM.phone}`} className="flex-1 border-2 border-white/30 hover:border-white text-white font-semibold text-base px-6 py-4 rounded-xl transition-colors text-center">
            Call Us
          </a>
        </div>
      </section>

      {/* Disclosure */}
      <div className="bg-gray-100 py-4 px-4 text-center">
        <p className="text-gray-500 text-xs max-w-3xl mx-auto">{DISCLOSURES.debtCollection}</p>
      </div>
    </>
  );
}
