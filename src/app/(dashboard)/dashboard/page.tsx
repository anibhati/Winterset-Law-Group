export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FIRM, DEBT_TYPE_LABELS } from "@/lib/constants";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role === "STAFF" || session.user.role === "ATTORNEY") redirect("/staff");

  let account = null;
  let planRequest = null;
  let dispute = null;
  let consultation = null;

  try {
    account = await db.debtAccount.findUnique({ where: { userId: session.user.id } });
    if (account) {
      planRequest = await db.paymentPlanRequest.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    }
    dispute = await db.disputeRequest.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    consultation = await db.consultationBooking.findFirst({
      where: { userId: session.user.id, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not connected yet
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ACTIVE: "bg-blue-100 text-blue-800",
    IN_PLAN: "bg-indigo-100 text-indigo-800",
    RESOLVED: "bg-green-100 text-green-800",
    DISPUTED: "bg-orange-100 text-orange-800",
    CONFIRMED: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">
          Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here&apos;s the status of your account with {FIRM.name}.</p>
      </div>

      {!account && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-400 text-sm mb-4">No account linked yet. Start the process to connect your Ohio debt account.</p>
          <Link href="/get-started" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors inline-block">
            Get Started
          </Link>
        </div>
      )}

      {account && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-bold text-navy-900">Your Account</h2>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[account.status] ?? "bg-gray-100 text-gray-600"}`}>
              {account.status.replace("_", " ")}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Account #</span><span className="font-mono font-semibold">{account.accountNumber}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-semibold">{DEBT_TYPE_LABELS[account.debtType] ?? account.debtType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Agency</span><span className="font-semibold text-right max-w-[60%]">{account.agency}</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-500">Balance Due</span>
              <span className="text-xl font-serif font-bold text-navy-900">
                ${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {planRequest && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-serif font-bold text-navy-900 mb-3">Payment Plan</h2>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[planRequest.status] ?? "bg-gray-100 text-gray-600"}`}>
              {planRequest.status === "PENDING" ? "Under Review" : planRequest.status}
            </span>
            <span className="text-gray-400 text-xs">
              Submitted {new Date(planRequest.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Frequency</span><span className="font-semibold capitalize">{planRequest.frequency.toLowerCase()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-semibold">${planRequest.installmentAmount.toFixed(2)}/payment</span></div>
          </div>
          {planRequest.status === "PENDING" && (
            <p className="text-gray-400 text-xs mt-3">Our team is reviewing your request. We will contact you within one to two business days.</p>
          )}
          {planRequest.staffNotes && (
            <div className="mt-3 bg-blue-50 rounded-xl p-3 text-xs text-blue-800">
              <strong>Note from our team:</strong> {planRequest.staffNotes}
            </div>
          )}
        </div>
      )}

      {consultation && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-serif font-bold text-navy-900 mb-3">Scheduled Call</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-navy-900 text-sm">
                {new Date(consultation.preferredDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="text-gray-500 text-sm">{consultation.timeSlot}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[consultation.status] ?? "bg-gray-100 text-gray-600"}`}>
              {consultation.status}
            </span>
          </div>
        </div>
      )}

      {dispute && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-serif font-bold text-navy-900 mb-3">Dispute</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{dispute.reason.replace(/_/g, " ")}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[dispute.status] ?? "bg-gray-100 text-gray-600"}`}>
              {dispute.status}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Link href="/payment" className="bg-navy-900 text-white rounded-2xl p-4 text-center hover:bg-navy-800 transition-colors">
          <div className="font-bold text-sm mb-1">Set Up Plan</div>
          <div className="text-white/60 text-xs">Start a new request</div>
        </Link>
        <Link href="/schedule" className="bg-gold-500 text-white rounded-2xl p-4 text-center hover:bg-gold-600 transition-colors">
          <div className="font-bold text-sm mb-1">Talk to Us</div>
          <div className="text-white/60 text-xs">Schedule a call</div>
        </Link>
        <Link href="/dispute" className="bg-red-700 text-white rounded-2xl p-4 text-center hover:bg-red-800 transition-colors">
          <div className="font-bold text-sm mb-1">File Dispute</div>
          <div className="text-white/60 text-xs">Contest your debt</div>
        </Link>
      </div>

      <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-900">Need immediate help?</p>
          <p className="text-gray-500 text-xs">{FIRM.hours}</p>
        </div>
        <a href={`tel:${FIRM.phone}`} className="bg-navy-900 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-navy-800 transition-colors">
          {FIRM.phone}
        </a>
      </div>
    </div>
  );
}
