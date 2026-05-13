import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="text-gold-400 uppercase tracking-widest text-xs font-semibold mb-4">
            Special Counsel · Ohio Attorney General
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-5">
            Got a Letter About Ohio State Debt?
            <br className="hidden md:block" />
            <span className="text-gold-400"> We Can Help Right From Your Phone.</span>
          </h1>
          <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {FIRM.name} makes it easy to understand your balance, set up a payment plan,
            or talk to an attorney, without coming in to fill out paperwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-started"
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg"
            >
              Get Started in 3 Minutes
            </Link>
            <a
              href={`tel:${FIRM.phone}`}
              className="border-2 border-white/40 hover:border-white text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
            >
              Call Us: {FIRM.phone}
            </a>
          </div>
          <p className="mt-5 text-white/40 text-sm">{FIRM.hours} &nbsp;·&nbsp; People First</p>
        </div>
      </section>

      {/* ── 3-Step How It Works ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-2xl md:text-3xl font-serif font-bold text-navy-900 mb-2">
            Resolve Your Debt in 3 Simple Steps
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto mb-10 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Enter Your Account Info",
                desc: "Provide your account number and a few personal details. Takes under 2 minutes.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
              },
              {
                num: "2",
                title: "Choose How to Resolve",
                desc: "Set up a payment plan that fits your budget, file a dispute, or schedule a call with an attorney.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                ),
              },
              {
                num: "3",
                title: "We Review & Confirm",
                desc: "Our team reviews your request and reaches out to confirm. You stay in the loop every step.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map(({ num, title, desc, icon }) => (
              <div key={num} className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-navy-900 text-gold-400 rounded-full flex items-center justify-center mb-4">
                  {icon}
                </div>
                <div className="w-6 h-6 bg-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center mb-3">
                  {num}
                </div>
                <h3 className="font-serif font-bold text-navy-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/get-started"
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-base px-10 py-4 rounded-xl transition-colors inline-block"
            >
              Start Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── What You Can Do ─────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-serif font-bold text-navy-900 mb-2">
            What Can I Do in the App?
          </h2>
          <div className="w-12 h-1 bg-gold-500 mx-auto mb-10 rounded-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                title: "Set Up a Payment Plan",
                desc: "Choose weekly, bi-weekly, or monthly payments at an amount that works for your budget. Submit for attorney review. No in-person visit needed.",
                tag: "Most Popular",
                tagColor: "bg-gold-500",
              },
              {
                title: "Schedule a Call",
                desc: "Book a time to speak directly with one of our attorneys. Pick a day and time that works for you. We call you.",
                tag: "Talk to a Person",
                tagColor: "bg-navy-900",
              },
              {
                title: "File a Dispute",
                desc: "If you believe the debt is incorrect or doesn't belong to you, submit a dispute right from the app. We review and follow up.",
                tag: "Know Your Rights",
                tagColor: "bg-gray-500",
              },
              {
                title: "Track Your Status",
                desc: "Log in anytime to see your plan status, next steps, and any messages from our team, all in one place.",
                tag: "Stay Informed",
                tagColor: "bg-gray-500",
              },
            ].map(({ title, desc, tag, tagColor }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <span className={`${tagColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                  {tag}
                </span>
                <h3 className="font-serif font-bold text-navy-900 text-lg mt-3 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Human Touch Callout ──────────────────────────────────────── */}
      <section className="bg-navy-900 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-gold-400 uppercase tracking-widest text-xs font-semibold mb-3">No Chatbots. Real People.</p>
          <h2 className="text-white font-serif font-bold text-2xl md:text-3xl mb-4">
            The App Handles the Paperwork. We Handle the Rest.
          </h2>
          <p className="text-white/70 leading-relaxed mb-6">
            We believe in person-to-person service. The app just removes the friction of coming in
            to fill out forms. An attorney still reviews every plan and is always a phone call away.
          </p>
          <a
            href={`tel:${FIRM.phone}`}
            className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors inline-block"
          >
            Call {FIRM.phone}
          </a>
          <p className="text-white/40 text-xs mt-4">{FIRM.hours}</p>
        </div>
      </section>

      {/* ── Disclosure ──────────────────────────────────────────────── */}
      <div className="bg-gray-100 py-4 px-4 text-center">
        <p className="text-gray-400 text-xs max-w-3xl mx-auto">{DISCLOSURES.debtCollection}</p>
      </div>
    </>
  );
}
