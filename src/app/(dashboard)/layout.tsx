import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { FIRM } from "@/lib/constants";

const navItems = [
  { href: "/dashboard", label: "My Account" },
  { href: "/schedule", label: "Schedule a Call" },
  { href: "/get-started", label: "Start New Request" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-navy-900 text-white py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="font-serif font-bold text-white hover:text-gold-400 transition-colors text-sm">
          {FIRM.shortName} Client Portal
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-xs hidden sm:block">{session.user.name || session.user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button className="text-white/60 hover:text-white text-xs transition-colors">Sign Out</button>
          </form>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>

      <nav className="sticky bottom-0 bg-white border-t border-gray-200 flex justify-around py-3 px-4 md:hidden">
        {navItems.map(({ href, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center text-center text-xs text-gray-500 hover:text-navy-900 transition-colors min-w-[64px]">
            {label}
          </Link>
        ))}
        <a href={`tel:${FIRM.phone}`} className="flex flex-col items-center text-xs text-gold-600 font-semibold min-w-[64px]">
          Call Us
        </a>
      </nav>
    </div>
  );
}
