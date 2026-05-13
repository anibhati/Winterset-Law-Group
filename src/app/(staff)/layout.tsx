import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { FIRM } from "@/lib/constants";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "STAFF" && session.user.role !== "ATTORNEY") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-navy-900 text-white py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/staff" className="font-serif font-bold text-white text-sm">
            {FIRM.shortName} Staff Portal
          </Link>
          <Link href="/staff" className="text-white/60 hover:text-white text-xs transition-colors">Dashboard</Link>
          <Link href="/staff/approvals" className="text-white/60 hover:text-white text-xs transition-colors">Approvals</Link>

        </div>
        <div className="flex items-center gap-3">
          <span className="text-gold-400 text-xs font-semibold uppercase">{session.user.role}</span>
          <span className="text-white/50 text-xs">{session.user.name || session.user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button className="text-white/50 hover:text-white text-xs transition-colors">Sign Out</button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
    </div>
  );
}
