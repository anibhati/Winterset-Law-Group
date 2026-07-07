"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AcceptInviteForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/staff/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/login");
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md text-center">
        <p className="text-red-600 text-sm">This invite link is missing a token. Please use the link from your invite email.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="card shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-serif font-bold text-navy-900">Set Up Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Create your password to activate your staff account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Re-enter your password"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Activating..." : "Activate Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteForm />
    </Suspense>
  );
}
