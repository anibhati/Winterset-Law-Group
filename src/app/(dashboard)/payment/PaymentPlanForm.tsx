"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const today = () => new Date().toISOString().split("T")[0];

export default function PaymentPlanForm({ currentBalance }: { currentBalance: number }) {
  const router = useRouter();
  const [frequency, setFrequency] = useState<"WEEKLY" | "BIWEEKLY" | "MONTHLY">("MONTHLY");
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [startDate, setStartDate] = useState(today());
  const [submitting, setSubmitting] = useState(false);

  const amount = parseFloat(installmentAmount);
  const validAmount = !isNaN(amount) && amount > 0;
  const estimatedPayments = validAmount ? Math.ceil(currentBalance / amount) : null;

  async function handleSubmit() {
    if (!validAmount) {
      toast.error("Please enter a valid installment amount.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, installmentAmount: amount, startDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      toast.success("Payment plan submitted. Our team will review within 1-2 business days.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div>
        <label className="block text-sm font-semibold text-navy-900 mb-2">Payment Frequency</label>
        <div className="grid grid-cols-3 gap-2">
          {(["WEEKLY", "BIWEEKLY", "MONTHLY"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className={`py-2 rounded-xl text-sm font-semibold transition-colors ${
                frequency === f
                  ? "bg-navy-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-navy-900 mb-2">Installment Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={installmentAmount}
            onChange={(e) => setInstallmentAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-300 rounded-xl pl-7 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>
        {estimatedPayments !== null && (
          <p className="text-xs text-gray-500 mt-2">
            Approximately {estimatedPayments} payment{estimatedPayments === 1 ? "" : "s"} to pay off your balance.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="start" className="block text-sm font-semibold text-navy-900 mb-2">First Payment Date</label>
        <input
          id="start"
          type="date"
          value={startDate}
          min={today()}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !validAmount}
        className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-colors"
      >
        {submitting ? "Submitting..." : "Submit Payment Plan Request"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Final plan terms are subject to attorney review. We will contact you to confirm.
      </p>
    </div>
  );
}
