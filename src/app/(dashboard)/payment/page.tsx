import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { FIRM, DEBT_TYPE_LABELS } from "@/lib/constants";
import PaymentPlanForm from "./PaymentPlanForm";

import BackButton from '@/components/ui/BackButton';
// ...
<div className="mb-6">
  <BackButton href="/dashboard" label="Back to dashboard" />
</div>

export default async function PaymentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const account = await db.debtAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!account) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-serif font-bold text-navy-900">Set Up a Payment Plan</h1>
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            You haven&apos;t linked a debt account yet. Start the process to connect your Ohio debt account.
          </p>
          <Link
            href="/get-started"
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors inline-block"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const pending = await db.paymentPlanRequest.findFirst({
    where: { userId: session.user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-serif font-bold text-navy-900">Set Up a Payment Plan</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <h2 className="font-semibold text-yellow-900 mb-2">You have a plan under review</h2>
          <p className="text-yellow-800 text-sm">
            Our team is reviewing your payment plan request submitted on{" "}
            {new Date(pending.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
            We&apos;ll contact you within 1–2 business days.
          </p>
          <p className="text-yellow-800 text-sm mt-3">
            If you need to make changes, please call us at{" "}
            <a href={`tel:${FIRM.phone}`} className="underline font-semibold">{FIRM.phone}</a>.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="block text-center bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Set Up a Payment Plan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose a frequency and installment amount that works for your budget.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Your Balance</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Account #</span><span className="font-mono font-semibold">{account.accountNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-semibold">{DEBT_TYPE_LABELS[account.debtType] ?? account.debtType}</span></div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-gray-500">Balance Due</span>
            <span className="text-xl font-serif font-bold text-navy-900">
              ${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <PaymentPlanForm currentBalance={account.currentBalance} />
    </div>
  );

  
}