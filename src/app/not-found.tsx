import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-white mb-4">404</h1>
        <p className="text-white/60 text-lg mb-8">This page doesn&apos;t exist.</p>
        <Link href="/" className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
