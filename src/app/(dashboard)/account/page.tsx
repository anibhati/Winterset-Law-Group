import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FIRM } from "@/lib/constants";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let user = null;
  try {
    user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-serif font-bold text-navy-900">Account</h1>

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
