import Link from "next/link";
import { FIRM } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimal header for auth pages */}
      <div className="bg-navy-900 py-4 px-6 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-white hover:text-gold-400 transition-colors">
          {FIRM.name}
        </Link>
        <a href={`tel:${FIRM.phone}`} className="text-white/60 hover:text-gold-400 text-sm transition-colors">
          {FIRM.phone}
        </a>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <div className="py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {FIRM.name} · {FIRM.hours}
      </div>
    </div>
  );
}
