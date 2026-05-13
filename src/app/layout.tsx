import type { Metadata, Viewport } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { DISCLOSURES } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

export const viewport: Viewport = {
  themeColor: "#1B2B4B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Winterset Law Group",
    template: "%s | Winterset Law Group",
  },
  description:
    "Resolve your Ohio state debt. Set up a payment plan, file a dispute, or schedule a call with an attorney.",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WLG",
  },
  formatDetection: { telephone: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <div className="disclosure-banner" role="banner" aria-label="Debt collection disclosure">
          {DISCLOSURES.debtCollection}
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
