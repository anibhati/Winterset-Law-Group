"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-white/60 text-sm mb-8">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
