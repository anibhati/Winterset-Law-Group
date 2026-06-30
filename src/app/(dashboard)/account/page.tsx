export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import { FIRM } from "@/lib/constants";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  IN_PLAN: "In Payment Plan",
  RESOLVED: "Resolved",
  DISPUTED: "Disputed",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-yellow-100 text-yellow-800",
  IN_PLAN: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  DISPUTED: "bg-red-100 text-red-800",
};

const DEBT_TYPE_LABELS: Record<string, string> = {
  INCOME_TAX: "Income Tax",
  BUSINESS_TAX: "Business Tax",
  SALES_TAX: "Sales Tax",
  WITHHOLDING_TAX: "Withholding Tax",
  BWC: "BWC",
  UNEMPLOYMENT: "Unemployment",
  MEDICAID: "Medicaid",
  OTHER: "Other",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let user = null;
  try {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        debtAccount: {
          select: {
            accountNumber: true,
            debtType: true,
            originalAmount: true,
            currentBalance: true,
            agency: true,
            status: true,
            planRequests: {
              where: { status: { in: ["PENDING", "APPROVED"] } },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { status: true, frequency: true, installmentAmount: true, startDate: true },
            },
          },
        },
      },
    });
  } catch {
    // DB not connected
  }

  const debt = user?.debtAccount;
  const activePlan = debt?.planRequests?.[0];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-serif font-bold text-navy-900">Account</h1>

      {/* Debt Account */}
      {debt ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Debt Account</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[debt.status] ?? "bg-gray-100 text-gray-600"}`}>
              {STATUS_LABELS[debt.status] ?? debt.status}
            </span>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: "Account #", value: debt.accountNumber },
              { label: "Debt Type", value: DEBT_TYPE_LABELS[debt.debtType] ?? debt.debtType },
              { label: "Agency", value: debt.agency },
              { label: "Original Amount", value: `$${debt.originalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
              { label: "Current Balance", value: `$${debt.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-navy-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Active Plan */}
          {activePlan && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-navy-900 mb-2">Payment Plan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activePlan.status === "APPROVED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {activePlan.status === "APPROVED" ? "Approved" : "Pending Review"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium">${activePlan.installmentAmount.toFixed(2)} / {activePlan.frequency.toLowerCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date</span>
                  <span className="font-medium">{new Date(activePlan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center space-y-2">
          <p className="text-gray-500 text-sm">No debt account linked to your profile yet.</p>
          <Link href="/get-started" className="text-navy-900 font-semibold text-sm underline">Look up your account</Link>
        </div>
      )}

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h2 className="font-semibold text-navy-900">Profile</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: "Name", value: user?.name || session.user.name || "—" },
            { label: "Email", value: user?.email || session.user.email || "—" },
            { label: "Phone", value: user?.phone ?? "—" },
            { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-navy-900">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          To update your contact information, call us at{" "}
          <a href={`tel:${FIRM.phone}`} className="text-navy-900 underline font-semibold">{FIRM.phone}</a>.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/get-started" className="bg-navy-900 text-white rounded-2xl p-4 text-center hover:bg-navy-800 transition-colors">
          <div className="font-bold text-sm mb-1">New Request</div>
          <div className="text-white/60 text-xs">Payment plan or dispute</div>
        </Link>
        <Link href="/schedule" className="bg-gold-500 text-white rounded-2xl p-4 text-center hover:bg-gold-600 transition-colors">
          <div className="font-bold text-sm mb-1">Schedule Call</div>
          <div className="text-white/60 text-xs">Talk to an attorney</div>
        </Link>
      </div>

      {/* Legal */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-navy-900 mb-3">Legal</h2>
        <div className="space-y-2 text-sm">
          <Link href="/legal/privacy" className="block text-navy-900 hover:underline">Privacy Policy</Link>
          <Link href="/legal/terms" className="block text-navy-900 hover:underline">Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  );
}
