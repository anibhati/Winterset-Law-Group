"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FIRM } from "@/lib/constants";
import Image from "next/image";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/focus", label: "Our Focus" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy-900 header-shadow sticky top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
<Link href="/" className="flex items-center group">
  <Image
    src="/WLGNew.png"
    alt={FIRM.name}
    width={240}
    height={48}
    priority
    className="h-10 w-auto group-hover:opacity-90 transition-opacity"
  />
</Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-white/80 hover:text-gold-400 text-sm font-medium transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Click-to-call */}
            <a
              href={`tel:${FIRM.phone}`}
              className="text-white/80 hover:text-gold-400 text-sm font-medium transition-colors"
              aria-label={`Call us at ${FIRM.phone}`}
            >
              {FIRM.phone}
            </a>

            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="btn-gold text-xs px-4 py-2">
                  My Account
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white/60 hover:text-white text-xs transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-gold text-xs px-4 py-2">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-navy-950 border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-white/80 hover:text-gold-400 text-sm font-medium py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href={`tel:${FIRM.phone}`}
              className="block text-white/80 hover:text-gold-400 text-sm font-medium py-2"
            >
              Call: {FIRM.phone}
            </a>
            {session ? (
              <>
                <Link href="/dashboard" className="block btn-gold text-center text-sm">
                  My Account
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left text-white/60 text-sm py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block btn-gold text-center text-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
