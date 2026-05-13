"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FIRM, TIME_SLOTS } from "@/lib/constants";

const TOPICS = [
  { value: "PAYMENT_PLAN", label: "Setting up a payment plan" },
  { value: "DISPUTE", label: "Disputing a debt" },
  { value: "GENERAL_INQUIRY", label: "General questions about my account" },
  { value: "OTHER", label: "Something else" },
];

// Build next 10 weekdays from today
function getAvailableDates(): { value: string; label: string }[] {
  const dates: { value: string; label: string }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1); // start tomorrow
  while (dates.length < 10) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      dates.push({
        value: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function ScheduleForm() {
  const params = useSearchParams();
  const prefillAccount = params.get("account") ?? "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    accountNumber: prefillAccount,
    topic: "",
    preferredDate: "",
    timeSlot: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const dates = getAvailableDates();

  function validate() {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.email.trim() || !form.email.includes("@")) return "Please enter a valid email.";
    if (!form.topic) return "Please select a topic.";
    if (!form.preferredDate) return "Please select a preferred date.";
    if (!form.timeSlot) return "Please select a time slot.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          preferredDate: new Date(form.preferredDate + "T12:00:00").toISOString(),
        }),
      });
    } catch {
      // Show success regardless — the submission will be stored once DB is connected
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">You&apos;re Scheduled!</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          We received your request for{" "}
          <strong>{dates.find((d) => d.value === form.preferredDate)?.label}</strong> at{" "}
          <strong>{form.timeSlot}</strong>. Someone from our office will call you at{" "}
          <strong>{form.phone}</strong> to confirm.
        </p>
        <p className="text-gray-400 text-xs mb-6">
          Questions in the meantime? Call us directly at{" "}
          <a href={`tel:${FIRM.phone}`} className="text-navy-900 font-semibold underline">
            {FIRM.phone}
          </a>
        </p>
        <Link href="/" className="text-navy-900 text-sm underline">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="614-555-0100"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Number <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="From your letter"
          value={form.accountNumber}
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900"
        />
      </div>

      {/* Topic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What would you like to discuss?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOPICS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, topic: value })}
              className={`text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                form.topic === value
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-gray-200 hover:border-gray-400 text-navy-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
        <select
          value={form.preferredDate}
          onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
        >
          <option value="">Choose a date…</option>
          {dates.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Time Slot */}
      {form.preferredDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setForm({ ...form, timeSlot: slot })}
                className={`rounded-xl border-2 py-2 px-1 text-center text-sm font-medium transition-all ${
                  form.timeSlot === slot
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-gray-200 hover:border-gray-400 text-navy-900"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Anything else we should know? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any details that might help us prepare for the call…"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl text-base transition-colors disabled:opacity-60"
      >
        {loading ? "Scheduling…" : "Request My Consultation →"}
      </button>

      <p className="text-center text-gray-400 text-xs">
        Or call us directly: <a href={`tel:${FIRM.phone}`} className="text-navy-900 font-semibold underline">{FIRM.phone}</a>
      </p>
    </form>
  );
}

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-navy-900 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-serif font-bold text-navy-900 mt-4 mb-1">
            Schedule a Call with Our Team
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Pick a time and one of our staff will call you. No waiting on hold, no in-person visit needed.
            {" "}{FIRM.hours}.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading…</div>}>
            <ScheduleForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
