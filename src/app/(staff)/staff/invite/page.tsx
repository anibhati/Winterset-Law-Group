"use client";

import { useState } from "react";

export default function InviteStaffPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STAFF");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setInviteLink(null);

    try {
      const res = await fetch("/api/staff/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to send invite." });
        return;
      }

      if (data.warning) {
        setMessage({ type: "error", text: data.warning });
        setInviteLink(data.inviteLink);
      } else {
        setMessage({ type: "success", text: `Invite sent to ${email}.` });
      }
      setEmail("");
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Invite Staff</h1>
        <p className="text-gray-500 text-sm mt-1">Send a new team member an invite to set up their account.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@wintersetlawgroup.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
          >
            <option value="STAFF">Staff</option>
            <option value="ATTORNEY">Attorney</option>
          </select>
        </div>

        {message && (
          <div className={`text-sm rounded-xl px-4 py-3 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        {inviteLink && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600 break-all">
            Email failed — share this link manually:{" "}
            <span className="font-mono">{typeof window !== "undefined" ? window.location.origin : ""}{inviteLink}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
        >
          {submitting ? "Sending..." : "Send Invite"}
        </button>
      </form>
    </div>
  );
}
