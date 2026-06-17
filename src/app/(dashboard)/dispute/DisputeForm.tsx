"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FIRM } from "@/lib/constants";

const REASONS = [
  { value: "WRONG_AMOUNT", label: "The amount is incorrect" },
  { value: "ALREADY_PAID", label: "This debt has already been paid" },
  { value: "NOT_MY_DEBT", label: "This is not my debt" },
  { value: "IDENTITY_THEFT", label: "I am a victim of identity theft" },
  { value: "OTHER", label: "Other" },
];

export default function DisputeForm() {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = reason !== "" && description.trim().length >= 20;

  async function handleSubmit() {
    if (!canSubmit) {
      toast.error("Please select a reason and provide at least 20 characters of detail.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      toast.success("Dispute filed. We will respond within three to five business days.");
      router.push("/dispute/success");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-2">Reason for Dispute</label>
        <div className="space-y-2">
          {REASONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setReason(value)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                reason === value
                  ? "bg-navy-900 text-white border-navy-900"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-navy-900 mb-2">
          Additional Details
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Please describe your dispute in detail. Include any relevant dates, amounts, or other information that supports your case."
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none"
        />
        <p className={`text-xs mt-1 ${description.trim().length >= 20 ? "text-gray-400" : "text-gray-400"}`}>
          {Math.max(0, 20 - description.trim().length) > 0
            ? `${20 - description.trim().length} more characters required`
            : "✓ Minimum length met"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !canSubmit}
        className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Dispute"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Filing a dispute does not pause collection activity. Call us at{" "}
        <a href={`tel:${FIRM.phone}`} className="underline">{FIRM.phone}</a> if you need immediate assistance.
      </p>
    </div>
  );
}