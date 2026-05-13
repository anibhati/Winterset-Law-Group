import Link from "next/link";
import { FIRM } from "@/lib/constants";

export default function StaffHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Staff Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{FIRM.name} — Internal Portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/staff/approvals" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="font-serif font-bold text-navy-900 text-lg mb-1">Payment Plans</div>
          <p className="text-gray-500 text-sm">Review and approve client plan requests.</p>
        </Link>
        <Link href="/staff/approvals" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="font-serif font-bold text-navy-900 text-lg mb-1">Scheduled Calls</div>
          <p className="text-gray-500 text-sm">View upcoming consultation bookings.</p>
        </Link>
        <Link href="/staff/approvals" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="font-serif font-bold text-navy-900 text-lg mb-1">Disputes</div>
          <p className="text-gray-500 text-sm">Review pending dispute filings.</p>
        </Link>
      </div>
    </div>
  );
}
