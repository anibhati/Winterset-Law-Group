"use client";

import { useState } from "react";
import Link from "next/link";
import { FIRM, DEBT_TYPE_LABELS, DISPUTE_REASON_LABELS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type Path = "plan" | "dispute" | "schedule";
type Frequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";
type DisputeReason = "WRONG_AMOUNT" | "ALREADY_PAID" | "NOT_MY_DEBT" | "IDENTITY_THEFT" | "OTHER";

interface AccountInfo {
  accountNumber: string;
  lastName: string;
  last4ssn: string;
}

interface DebtSummary {
  accountNumber: string;
  debtorName: string;
  debtType: string;
  currentBalance: number;
  agency: string;
}

interface PlanForm {
  frequency: Frequency | "";
  installmentAmount: string;
  startDate: string;
}

interface DisputeForm {
  reason: DisputeReason | "";
  description: string;
  name: string;
  email: string;
  phone: string;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
      <div
        className="bg-gold-500 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────
function WizardShell({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  children,
}: {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-navy-900 px-4 py-4 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-white/60 hover:text-white transition-colors mr-1" aria-label="Go back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <Link href="/" className="text-white font-serif font-bold text-sm">
          {FIRM.shortName}
        </Link>
        <span className="text-white/30 text-xs ml-auto">
          Step {step} of {totalSteps}
        </span>
      </div>
      <Progress step={step} total={totalSteps} />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-serif font-bold text-navy-900 mb-1">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mb-6 leading-relaxed">{subtitle}</p>}
          {children}
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-200 bg-white">
        <p className="text-gray-400 text-xs">
          Need help?{" "}
          <a href={`tel:${FIRM.phone}`} className="text-navy-900 font-semibold underline">
            Call us at {FIRM.phone}
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Big option card ──────────────────────────────────────────────────────────
function OptionCard({
  icon,
  title,
  desc,
  tag,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left border-2 border-gray-200 hover:border-navy-900 bg-white rounded-2xl p-5 flex items-start gap-4 transition-all group active:scale-[0.99]"
    >
      <div className="w-12 h-12 bg-navy-50 text-navy-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-navy-900 group-hover:text-gold-400 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-serif font-bold text-navy-900 text-base">{title}</span>
          {tag && (
            <span className="bg-gold-100 text-gold-700 text-xs font-semibold px-2 py-0.5 rounded-full">{tag}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm leading-snug">{desc}</p>
      </div>
      <svg className="w-5 h-5 text-gray-300 group-hover:text-navy-900 mt-1 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────
export default function GetStartedPage() {
  const [step, setStep] = useState(1);
  const [path, setPath] = useState<Path | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    accountNumber: "",
    lastName: "",
    last4ssn: "",
  });
  const [debt, setDebt] = useState<DebtSummary | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  const [planForm, setPlanForm] = useState<PlanForm>({ frequency: "", installmentAmount: "", startDate: "" });
  const [planError, setPlanError] = useState("");

  const [disputeForm, setDisputeForm] = useState<DisputeForm>({
    reason: "",
    description: "",
    name: "",
    email: "",
    phone: "",
  });
  const [disputeError, setDisputeError] = useState("");

  const totalSteps = path === "schedule" ? 3 : path === "dispute" ? 5 : path === "plan" ? 5 : 3;

  // ── Step 1: Account Lookup ──────────────────────────────────────────────────
  if (step === 1) {
    async function handleLookup(e: React.FormEvent) {
      e.preventDefault();
      setLookupError("");

      if (!accountInfo.accountNumber.trim() || !accountInfo.lastName.trim() || !accountInfo.last4ssn.trim()) {
        setLookupError("Please enter your account number, last name, and last 4 of SSN.");
        return;
      }
      if (!/^\d{4}$/.test(accountInfo.last4ssn.trim())) {
        setLookupError("Last 4 of SSN must be exactly 4 digits.");
        return;
      }

      setLookupLoading(true);

      try {
        const res = await fetch("/api/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountNumber: accountInfo.accountNumber,
            lastName: accountInfo.lastName,
            last4Ssn: accountInfo.last4ssn,
          }),
        });

        const data = await res.json();
        setLookupLoading(false);

        if (!res.ok) {
          setLookupError(data.error || "We couldn't find an account with those details. Please check your information or call us.");
          return;
        }

        setDebt({
          accountNumber: data.accountNumber,
          debtorName: data.debtorName,
          debtType: data.debtType,
          currentBalance: data.currentBalance,
          agency: data.agency,
        });
        setStep(2);
      } catch (err) {
        setLookupLoading(false);
        setLookupError("Could not reach the server. Please try again or call us.");
      }
    }

    return (
      <WizardShell step={1} totalSteps={totalSteps} title="Find Your Account" subtitle="Enter the account number from your letter and your last name.">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              placeholder="e.g. WLG-2026-001"
              value={accountInfo.accountNumber}
              onChange={(e) => setAccountInfo({ ...accountInfo, accountNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
              autoFocus
            />
            <p className="text-gray-400 text-xs mt-1">Found on your letter from the Ohio Attorney General.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Your last name"
              value={accountInfo.lastName}
              onChange={(e) => setAccountInfo({ ...accountInfo, lastName: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 digits of SSN <span className="text-gray-400 font-normal">(for verification)</span></label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={accountInfo.last4ssn}
              onChange={(e) => setAccountInfo({ ...accountInfo, last4ssn: e.target.value.replace(/\D/g, "") })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent tracking-widest"
            />
          </div>
          {lookupError && <p className="text-red-600 text-sm">{lookupError}</p>}
          <button
            type="submit"
            disabled={lookupLoading}
            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl text-base transition-colors disabled:opacity-60"
          >
            {lookupLoading ? "Looking up your account…" : "Find My Account →"}
          </button>
          <p className="text-center text-gray-400 text-xs">
            Don&apos;t have your account number?{" "}
            <Link href="/schedule" className="text-navy-900 underline">Schedule a call</Link> and we can help.
          </p>
        </form>
      </WizardShell>
    );
  }

  // ── Step 2: Debt Summary ────────────────────────────────────────────────────
  if (step === 2 && debt) {
    return (
      <WizardShell step={2} totalSteps={totalSteps} title="Here's What We Found" subtitle="Please confirm your account details look correct." onBack={() => setStep(1)}>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">Account Number</span>
            <span className="font-mono font-semibold text-navy-900 text-sm">{debt.accountNumber}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">Name on Account</span>
            <span className="font-semibold text-navy-900 text-sm">{debt.debtorName}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">Debt Type</span>
            <span className="font-semibold text-navy-900 text-sm">{DEBT_TYPE_LABELS[debt.debtType] ?? debt.debtType}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">Agency</span>
            <span className="font-semibold text-navy-900 text-sm text-right max-w-[60%]">{debt.agency}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">Balance Due</span>
            <span className="text-2xl font-serif font-bold text-navy-900">
              ${debt.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
          Interest accrues at 8% per year under Ohio law. Acting now reduces your total balance.
        </div>

        <button
          onClick={() => setStep(3)}
          className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl text-base transition-colors mb-3"
        >
          This Looks Correct, Continue →
        </button>
        <button
          onClick={() => { setPath("dispute"); setStep(4); }}
          className="w-full border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Something looks wrong: I want to dispute this
        </button>
      </WizardShell>
    );
  }

  // ── Step 3: Choose Path ─────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <WizardShell step={3} totalSteps={totalSteps} title="How Would You Like to Resolve This?" subtitle="Choose the option that works best for you. You can always call us too." onBack={() => setStep(2)}>
        <div className="space-y-3">
          <OptionCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></svg>}
            title="Set Up a Payment Plan"
            desc="Choose weekly, bi-weekly, or monthly installments that fit your budget. Submitted for attorney review."
            tag="Most Popular"
            onClick={() => { setPath("plan"); setStep(4); }}
          />
          <OptionCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
            title="Talk to an Attorney"
            desc="Schedule a call with one of our attorneys. Pick a time that works for you. We call you."
            onClick={() => { setPath("schedule"); setStep(4); }}
          />
          <OptionCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>}
            title="Dispute This Debt"
            desc="Believe the amount is wrong or the debt isn't yours? File a dispute and our team will review it."
            onClick={() => { setPath("dispute"); setStep(4); }}
          />
        </div>
      </WizardShell>
    );
  }

  // ── Step 4A: Payment Plan Form ──────────────────────────────────────────────
  if (step === 4 && path === "plan") {
    const frequencies: { value: Frequency; label: string; sublabel: string }[] = [
      { value: "WEEKLY", label: "Weekly", sublabel: "Every week" },
      { value: "BIWEEKLY", label: "Bi-Weekly", sublabel: "Every 2 weeks" },
      { value: "MONTHLY", label: "Monthly", sublabel: "Once a month" },
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    function handlePlanContinue() {
      setPlanError("");
      if (!planForm.frequency) { setPlanError("Please select a payment frequency."); return; }
      if (!planForm.installmentAmount || parseFloat(planForm.installmentAmount) < 25) {
        setPlanError("Please enter a payment amount of at least $25."); return;
      }
      if (!planForm.startDate) { setPlanError("Please select a start date."); return; }
      if (planForm.startDate < minDate) {
        setPlanError("Start date must be today or later. Please choose a future date."); return;
      }
      setStep(5);
    }

    return (
      <WizardShell step={4} totalSteps={5} title="Set Up Your Payment Plan" subtitle="Choose a schedule and amount that fits your budget." onBack={() => setStep(3)}>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How often will you pay?</label>
            <div className="grid grid-cols-3 gap-2">
              {frequencies.map(({ value, label, sublabel }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlanForm({ ...planForm, frequency: value })}
                  className={`rounded-xl border-2 py-3 px-2 text-center transition-all ${
                    planForm.frequency === value
                      ? "border-navy-900 bg-navy-900 text-white"
                      : "border-gray-200 hover:border-gray-400 text-navy-900"
                  }`}
                >
                  <div className="font-bold text-sm">{label}</div>
                  <div className={`text-xs mt-0.5 ${planForm.frequency === value ? "text-gold-400" : "text-gray-400"}`}>{sublabel}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment amount per installment</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">$</span>
              <input
                type="number"
                min={25}
                step={5}
                placeholder="0.00"
                value={planForm.installmentAmount}
                onChange={(e) => setPlanForm({ ...planForm, installmentAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>
            {debt && planForm.installmentAmount && parseFloat(planForm.installmentAmount) > 0 && (
              <p className="text-gray-400 text-xs mt-1">
                Estimated payoff: ~{Math.ceil(debt.currentBalance / parseFloat(planForm.installmentAmount))} payments
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First payment date</label>
            <input
              type="date"
              min={minDate}
              value={planForm.startDate}
              onChange={(e) => setPlanForm({ ...planForm, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          {planError && <p className="text-red-600 text-sm">{planError}</p>}

          <button
            onClick={handlePlanContinue}
            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl text-base transition-colors"
          >
            Review My Plan →
          </button>
        </div>
      </WizardShell>
    );
  }

  // ── Step 5A: Review & Submit Plan ──────────────────────────────────────────
  if (step === 5 && path === "plan") {
    if (submitted) {
      return (
        <WizardShell step={5} totalSteps={5} title="Plan Submitted!">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">Your Plan Is Under Review</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Our team will review your payment plan request and contact you within one to two business days.
              If you have questions in the meantime, give us a call.
            </p>
            <a
              href={`tel:${FIRM.phone}`}
              className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block mb-4"
            >
              Call {FIRM.phone}
            </a>
            <br />
            <Link href="/login" className="text-navy-900 text-sm underline">Create an account to track your status</Link>
          </div>
        </WizardShell>
      );
    }

    const freqLabel: Record<Frequency, string> = { WEEKLY: "Weekly", BIWEEKLY: "Bi-Weekly", MONTHLY: "Monthly" };

    return (
      <WizardShell step={5} totalSteps={5} title="Review Your Payment Plan" subtitle="Everything look good? Submit to send your plan to our team for review." onBack={() => setStep(4)}>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account</span>
            <span className="font-mono font-semibold text-navy-900">{debt?.accountNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Balance</span>
            <span className="font-semibold text-navy-900">
              ${debt?.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Frequency</span>
            <span className="font-semibold text-navy-900">{planForm.frequency ? freqLabel[planForm.frequency as Frequency] : ""}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Amount</span>
            <span className="font-semibold text-navy-900">${parseFloat(planForm.installmentAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">First Payment</span>
            <span className="font-semibold text-navy-900">{new Date(planForm.startDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        <p className="text-gray-400 text-xs mb-5 leading-relaxed">
          By submitting, you are requesting (not confirming) a payment plan. An attorney at {FIRM.name} will review
          your request and contact you to finalize the arrangement.
        </p>

        <button
          onClick={async () => { const res = await fetch('/api/payment-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accountNumber: debt?.accountNumber ?? accountInfo.accountNumber, frequency: planForm.frequency, installmentAmount: planForm.installmentAmount, startDate: planForm.startDate }) }); if (res.ok) setSubmitted(true); else setPlanError('Submission failed. Please try again.'); }}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-base transition-colors mb-3"
        >
          Submit Payment Plan Request
        </button>
        <button
          onClick={() => setStep(4)}
          className="w-full border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Go Back &amp; Edit
        </button>
      </WizardShell>
    );
  }

  // ── Step 4B: Schedule a Call (within wizard) ────────────────────────────────
  if (step === 4 && path === "schedule") {
    return (
      <WizardShell step={3} totalSteps={3} title="Schedule a Call" subtitle="Pick a time and we'll call you." onBack={() => setStep(3)}>
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm mb-6">You&apos;re being redirected to our scheduling page where you can pick a date and time.</p>
          <Link
            href={`/schedule?account=${encodeURIComponent(debt?.accountNumber ?? "")}`}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-10 rounded-xl text-base transition-colors inline-block"
          >
            Choose a Time →
          </Link>
        </div>
      </WizardShell>
    );
  }

  // ── Step 4B: Dispute Form ───────────────────────────────────────────────────
  if (step === 4 && path === "dispute") {
    function handleDisputeContinue() {
      setDisputeError("");
      if (!disputeForm.reason) { setDisputeError("Please select a reason."); return; }
      if (!disputeForm.description.trim() || disputeForm.description.length < 20) {
        setDisputeError("Please describe your dispute in more detail (at least 20 characters)."); return;
      }
      if (!disputeForm.name.trim() || !disputeForm.email.trim() || !disputeForm.phone.trim()) {
        setDisputeError("Please fill in all contact fields."); return;
      }
      setStep(5);
    }

    return (
      <WizardShell step={4} totalSteps={5} title="Tell Us About the Dispute" subtitle="Fill in the details below. Our team will review your case." onBack={() => setStep(path === "dispute" && debt ? 3 : 2)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What&apos;s the reason for the dispute?</label>
            <select
              value={disputeForm.reason}
              onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value as DisputeReason })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
            >
              <option value="">Select a reason…</option>
              {Object.entries(DISPUTE_REASON_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Describe your dispute</label>
            <textarea
              rows={4}
              placeholder="Explain why you believe this debt is incorrect or doesn't belong to you…"
              value={disputeForm.description}
              onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Your contact information</p>
            <input
              type="text"
              placeholder="Full name"
              value={disputeForm.name}
              onChange={(e) => setDisputeForm({ ...disputeForm, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
            <input
              type="email"
              placeholder="Email address"
              value={disputeForm.email}
              onChange={(e) => setDisputeForm({ ...disputeForm, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={disputeForm.phone}
              onChange={(e) => setDisputeForm({ ...disputeForm, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> For complex disputes, calling us directly is often faster:{" "}
            <a href={`tel:${FIRM.phone}`} className="underline font-semibold">{FIRM.phone}</a>
          </div>

          {disputeError && <p className="text-red-600 text-sm">{disputeError}</p>}

          <button
            onClick={handleDisputeContinue}
            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl text-base transition-colors"
          >
            Review &amp; Submit Dispute →
          </button>
        </div>
      </WizardShell>
    );
  }

  // ── Step 5B: Review & Submit Dispute ───────────────────────────────────────
  if (step === 5 && path === "dispute") {
    if (submitted) {
      return (
        <WizardShell step={5} totalSteps={5} title="Dispute Filed">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">Your Dispute Has Been Filed</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Our team will review your dispute and respond within one to two business days.
              We strongly recommend also giving us a call so we can discuss your case directly.
            </p>
            <a
              href={`tel:${FIRM.phone}`}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block"
            >
              Call Us: {FIRM.phone}
            </a>
          </div>
        </WizardShell>
      );
    }

    return (
      <WizardShell step={5} totalSteps={5} title="Review Your Dispute" subtitle="Confirm your details before submitting." onBack={() => setStep(4)}>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-mono font-semibold">{debt?.accountNumber ?? accountInfo.accountNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Reason</span><span className="font-semibold text-navy-900 text-right max-w-[60%]">{DISPUTE_REASON_LABELS[disputeForm.reason as string] ?? ""}</span></div>
          <div className="flex flex-col gap-1"><span className="text-gray-500">Description</span><span className="text-navy-900 text-xs leading-relaxed">{disputeForm.description}</span></div>
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{disputeForm.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-semibold">{disputeForm.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold">{disputeForm.phone}</span></div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-5">
          We recommend calling <a href={`tel:${FIRM.phone}`} className="font-semibold underline">{FIRM.phone}</a> to discuss your dispute with an attorney directly.
        </div>

        <button onClick={async () => { const res = await fetch("/api/dispute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accountNumber: debt?.accountNumber ?? accountInfo.accountNumber, reason: disputeForm.reason, description: disputeForm.description, name: disputeForm.name, email: disputeForm.email, phone: disputeForm.phone }) }); if (res.ok) setSubmitted(true); else setDisputeError("Submission failed. Please try again."); }} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl text-base transition-colors mb-3">
          Submit Dispute
        </button>
        <button onClick={() => setStep(4)} className="w-full border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors">
          Go Back &amp; Edit
        </button>
      </WizardShell>
    );
  }

  return null;
}
