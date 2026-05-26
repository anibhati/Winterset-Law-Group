import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FIRM } from "@/lib/constants";
import DisputeForm from "./DisputeForm";

export default async function DisputePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const account = await db.debtAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!account) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-serif font-bold text-navy-900">File a Dispute</h1>
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            You haven&apos;t linked a debt account yet.
          </p>
          <Link href="/get-started" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors inline-block">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const pending = await db.disputeRequest.findFirst({
    where: { userId: session.user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-serif font-bold text-navy-900">File a Dispute</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <h2 className="font-semibold text-yellow-900 mb-2">You have a dispute under review</h2>
          <p className="text-yellow-800 text-sm">
            Our team is reviewing your dispute submitted on{" "}
            {new Date(pending.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
            We&apos;ll contact you within 3–5 business days.
          </p>
          <p className="text-yellow-800 text-sm mt-3">
            Questions? Call us at{" "}
            <a href={`tel:${FIRM.phone}`} className="underline font-semibold">{FIRM.phone}</a>.
          </p>
        </div>
        <Link href="/dashboard" className="block text-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">File a Dispute</h1>
        <p className="text-gray-500 text-sm mt-1">
          Dispute the amount, ownership, or validity of your debt.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Account #</span>
            <span className="font-mono font-semibold">{account.accountNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Balance</span>
            <span className="font-semibold">${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <DisputeForm />
    </div>
  );
}