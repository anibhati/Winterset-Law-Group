"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AcceptInvitePage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/staff/accept-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-xl font-semibold mb-4">Set Up Your Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
          minLength={8}
        />
        <button type="submit" className="bg-navy-900 text-white px-4 py-2 rounded">
          Activate Account
        </button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}