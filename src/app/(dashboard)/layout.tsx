export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { FIRM } from "@/lib/constants";
import BottomNav from "@/components/dashboard/BottomNav";
import NotificationBell from "@/components/dashboard/NotificationBell";
import SignOutButton from "@/components/dashboard/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role === "STAFF" || session.user.role === "ATTORNEY") redirect("/staff");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-navy-900 text-white py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <Link href="/dashboard" className="font-serif font-bold text-white hover:text-gold-400 transition-colors text-sm">
          {FIRM.shortName} Client Portal
        </Link>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <span className="text-white/60 text-xs hidden sm:block">
            {session.user.name || session.user.email}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
