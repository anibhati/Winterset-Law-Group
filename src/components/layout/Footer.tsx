import Link from "next/link";
import { FIRM, DISCLOSURES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Firm Info */}
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-2">{FIRM.name}</h3>
            <p className="text-gold-500 text-xs uppercase tracking-widest mb-4">{FIRM.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed">
              {FIRM.role} under {FIRM.authority}.<br />
              Serving Ohio since {FIRM.servingSince}.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href={`tel:${FIRM.phone}`} className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span>📞</span> {FIRM.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${FIRM.email}`} className="hover:text-gold-400 transition-colors flex items-center gap-2 break-all">
                  <span>✉️</span> {FIRM.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span> Text &ldquo;{FIRM.smsKeyword}&rdquo; to {FIRM.smsNumber}
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> {FIRM.hours}
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-white/70 hover:text-gold-400 transition-colors">About WLG</Link></li>
              <li><Link href="/focus" className="text-white/70 hover:text-gold-400 transition-colors">Our Focus</Link></li>
              <li><Link href="/sms-optin" className="text-white/70 hover:text-gold-400 transition-colors">SMS Updates</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-gold-400 transition-colors">Contact</Link></li>
              <li><Link href="/legal/terms" className="text-white/70 hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/legal/privacy" className="text-white/70 hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/sms-terms" className="text-white/70 hover:text-gold-400 transition-colors">SMS Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Gold divider */}
        <div className="mt-10 pt-8 border-t border-white/10">
          {/* FDCPA Required Disclosure */}
          <p className="text-white/50 text-xs text-center mb-4 italic">
            {DISCLOSURES.debtCollection}
          </p>
          <p className="text-white/40 text-xs text-center">
            &copy; {new Date().getFullYear()} {FIRM.name}. All rights reserved. |{" "}
            {FIRM.partner.name}, Managing Partner.
          </p>
        </div>
      </div>
    </footer>
  );
}
