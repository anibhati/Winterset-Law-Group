"use client";
import { useState, useEffect, useCallback } from "react";
import { ApprovalsSkeleton } from "@/components/ui/Skeleton";
import { FIRM, DEBT_TYPE_LABELS } from "@/lib/constants";

interface Plan {
  id: string;
  frequency: string;
  installmentAmount: number;
  startDate: string;
  status: string;
  createdAt: string;
  staffNotes?: string;
  user: { name: string; email: string; phone?: string };
  debtAccount: { accountNumber: string; debtType: string; currentBalance: number; agency: string };
}

interface Consultation {
  id: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  accountNumber?: string;
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  status: string;
}

interface Dispute {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

const FREQ_LABELS: Record<string, string> = { WEEKLY: "Weekly", BIWEEKLY: "Bi-Weekly", MONTHLY: "Monthly" };
const TOPIC_LABELS: Record<string, string> = {
  PAYMENT_PLAN: "Payment Plan",
  DISPUTE: "Dispute",
  GENERAL_INQUIRY: "General Inquiry",
  OTHER: "Other",
};

export default function ApprovalsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState<"plans" | "calls" | "disputes">("plans");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes, dRes] = await Promise.all([
        fetch("/api/payment-plan"),
        fetch("/api/consultation"),
        fetch("/api/dispute"),
      ]);
      if (pRes.ok) setPlans(await pRes.json());
      if (cRes.ok) setConsultations(await cRes.json());
      if (dRes.ok) setDisputes(await dRes.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function reviewPlan(planId: string, action: "APPROVED" | "REJECTED") {
    await fetch("/api/staff/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, action, staffNotes: notes }),
    });
    setReviewingId(null);
    setNotes("");
    fetchAll();
  }

  async function reviewDispute(disputeId: string, action: "APPROVED" | "REJECTED") {
    await fetch("/api/staff/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disputeId, action, staffNotes: notes }),
    });
    setReviewingId(null);
    setNotes("");
    fetchAll();
  }

  async function reviewConsultation(consultationId: string, action: "CONFIRMED" | "CANCELLED") {
    await fetch("/api/staff/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consultationId, action, staffNotes: notes }),
    });
    setReviewingId(null);
    setNotes("");
    fetchAll();
  }

  const tabs = [
    { key: "plans" as const, label: "Payment Plans", count: plans.length },
    { key: "calls" as const, label: "Scheduled Calls", count: consultations.length },
    { key: "disputes" as const, label: "Disputes", count: disputes.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Pending Approvals</h1>
        <p className="text-gray-500 text-sm mt-1">Review and act on client requests.</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? "border-navy-900 text-navy-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
            {count > 0 && (
              <span className="ml-2 bg-gold-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">{count}</span>
            )}
          </button>
        ))}
      </div>
      {loading && <ApprovalsSkeleton />}
      {loading {loading && <p className="text-gray-400 text-sm">Loading…</p>}{loading && <p className="text-gray-400 text-sm">Loading…</p>} <ApprovalsSkeleton />}

      {/* Payment Plans */}
      {activeTab === "plans" && !loading && (
        <div className="space-y-4">
          {plans.length === 0 && <p className="text-gray-400 text-sm">No pending payment plan requests.</p>}
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-serif font-bold text-navy-900">{plan.user.name}</p>
                  <p className="text-gray-500 text-sm">{plan.user.email} · {plan.user.phone ?? "—"}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(plan.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-gray-500">Account</span><p className="font-mono font-semibold">{plan.debtAccount.accountNumber}</p></div>
                <div><span className="text-gray-500">Balance</span><p className="font-semibold">${plan.debtAccount.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p></div>
                <div><span className="text-gray-500">Debt Type</span><p className="font-semibold">{DEBT_TYPE_LABELS[plan.debtAccount.debtType] ?? plan.debtAccount.debtType}</p></div>
                <div><span className="text-gray-500">Agency</span><p className="font-semibold text-xs">{plan.debtAccount.agency}</p></div>
                <div><span className="text-gray-500">Frequency</span><p className="font-semibold">{FREQ_LABELS[plan.frequency] ?? plan.frequency}</p></div>
                <div><span className="text-gray-500">Amount</span><p className="font-semibold">${plan.installmentAmount.toFixed(2)}/payment</p></div>
                <div><span className="text-gray-500">Start Date</span><p className="font-semibold">{new Date(plan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div>
              </div>
              {reviewingId === plan.id ? (
                <div className="space-y-3">
                  <textarea rows={2} placeholder="Optional notes to client…" value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => reviewPlan(plan.id, "APPROVED")} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Approve</button>
                    <button onClick={() => reviewPlan(plan.id, "REJECTED")} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Reject</button>
                    <button onClick={() => setReviewingId(null)} className="px-4 border-2 border-gray-200 text-gray-600 font-semibold py-2 rounded-xl text-sm hover:border-gray-400 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setReviewingId(plan.id); setNotes(""); }}
                  className="w-full border-2 border-navy-900 text-navy-900 font-bold py-2.5 rounded-xl text-sm hover:bg-navy-900 hover:text-white transition-colors">
                  Review This Plan
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Calls */}
      {activeTab === "calls" && !loading && (
        <div className="space-y-4">
          {consultations.length === 0 && <p className="text-gray-400 text-sm">No pending consultation requests.</p>}
          {consultations.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-serif font-bold text-navy-900">{c.name}</p>
                  <p className="text-gray-500 text-sm">{c.email}</p>
                </div>
                <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">{c.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Phone</span><p className="font-semibold"><a href={`tel:${c.phone}`} className="text-navy-900 underline">{c.phone}</a></p></div>
                <div><span className="text-gray-500">Topic</span><p className="font-semibold">{TOPIC_LABELS[c.topic] ?? c.topic}</p></div>
                <div><span className="text-gray-500">Date</span><p className="font-semibold">{new Date(c.preferredDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p></div>
                <div><span className="text-gray-500">Time</span><p className="font-semibold">{c.timeSlot}</p></div>
                {c.accountNumber && <div className="col-span-2"><span className="text-gray-500">Account #</span><p className="font-mono font-semibold">{c.accountNumber}</p></div>}
                {c.notes && <div className="col-span-2"><span className="text-gray-500">Notes</span><p className="text-xs text-gray-700">{c.notes}</p></div>}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${c.phone}`}
                  className="flex-1 flex items-center justify-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  Call {c.name.split(" ")[0]}
                </a>
                {reviewingId === c.id ? (
                  <div className="flex-1 space-y-2">
                    <textarea rows={2} placeholder="Optional notes…" value={notes} onChange={(e) => setNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => reviewConsultation(c.id, "CONFIRMED")} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Confirm</button>
                      <button onClick={() => reviewConsultation(c.id, "CANCELLED")} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Cancel</button>
                      <button onClick={() => setReviewingId(null)} className="px-3 border-2 border-gray-200 text-gray-600 font-semibold py-2 rounded-xl text-sm hover:border-gray-400 transition-colors">✕</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setReviewingId(c.id); setNotes(""); }}
                    className="flex-1 border-2 border-navy-900 text-navy-900 font-bold py-2.5 rounded-xl text-sm hover:bg-navy-900 hover:text-white transition-colors">
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disputes */}
      {activeTab === "disputes" && !loading && (
        <div className="space-y-4">
          {disputes.length === 0 && <p className="text-gray-400 text-sm">No pending disputes.</p>}
          {disputes.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-serif font-bold text-navy-900">{d.name}</p>
                  <p className="text-gray-500 text-sm">{d.email} · {d.phone}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Account #</span><span className="font-mono font-semibold">{d.accountNumber}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Reason</span><span className="font-semibold">{d.reason.replace(/_/g, " ")}</span></div>
                <div><span className="text-gray-500">Description</span><p className="text-gray-700 text-xs mt-1 leading-relaxed">{d.description}</p></div>
              </div>
              {reviewingId === d.id ? (
                <div className="space-y-3">
                  <textarea rows={2} placeholder="Optional notes to client…" value={notes} onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => reviewDispute(d.id, "APPROVED")} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Approve</button>
                    <button onClick={() => reviewDispute(d.id, "REJECTED")} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-sm transition-colors">Reject</button>
                    <button onClick={() => setReviewingId(null)} className="px-4 border-2 border-gray-200 text-gray-600 font-semibold py-2 rounded-xl text-sm hover:border-gray-400 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setReviewingId(d.id); setNotes(""); }}
                  className="w-full border-2 border-navy-900 text-navy-900 font-bold py-2.5 rounded-xl text-sm hover:bg-navy-900 hover:text-white transition-colors">
                  Review This Dispute
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
