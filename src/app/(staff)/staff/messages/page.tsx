// src/app/(staff)/staff/messages/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

interface Thread {
  id: string;
  subject: string;
  status: string;
  updatedAt: string;
  hasUnread: boolean;
  user: { id: string; name: string; email: string };
  debtAccount: { accountNumber: string } | null;
  messages: {
    content: string;
    createdAt: string;
    senderId: string;
    readAt: string | null;
  }[];
}

interface ThreadMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

interface Client {
  id: string;
  name: string;
  email: string;
}

type Tab = "threads" | "notify";

export default function StaffMessagesPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("threads");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  // Thread detail
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // Notification form
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [notifSending, setNotifSending] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/threads");
      if (res.ok) setThreads(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch("/api/staff/clients");
      if (res.ok) setClients(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
    fetchClients();
  }, [fetchThreads, fetchClients]);

  async function openThread(threadId: string) {
    setActiveThread(threadId);
    try {
      const res = await fetch(`/api/messages/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setThreadMessages(data.messages);
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function sendReply() {
    if (!reply.trim() || !activeThread) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/threads/${activeThread}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      if (res.ok) {
        setReply("");
        openThread(activeThread);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function closeThread(threadId: string) {
    try {
      await fetch(`/api/staff/threads/${threadId}/close`, { method: "PATCH" });
      setActiveThread(null);
      fetchThreads();
    } catch (err) {
      console.error(err);
    }
  }

  async function sendNotification() {
    if (!selectedClient || !notifTitle.trim() || !notifBody.trim()) return;
    setNotifSending(true);
    setNotifSuccess(false);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedClient,
          title: notifTitle.trim(),
          body: notifBody.trim(),
        }),
      });
      if (res.ok) {
        setNotifTitle("");
        setNotifBody("");
        setSelectedClient("");
        setNotifSuccess(true);
        setTimeout(() => setNotifSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNotifSending(false);
    }
  }

  const unreadCount = threads.filter((t) => t.hasUnread).length;

  // ── Thread detail view ──────────────────────────────────────────
  if (activeThread) {
    const thread = threads.find((t) => t.id === activeThread);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveThread(null)}
            className="text-sm text-gold-600 hover:underline"
          >
            ← Back to threads
          </button>
          {thread?.status === "OPEN" && (
            <button
              onClick={() => closeThread(activeThread)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Close Thread
            </button>
          )}
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-navy-900">
            {thread?.subject ?? "Thread"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {thread?.user.name} · {thread?.user.email}
            {thread?.debtAccount && (
              <span className="font-mono ml-2">#{thread.debtAccount.accountNumber}</span>
            )}
          </p>
        </div>

        <div className="space-y-3">
          {threadMessages.map((msg) => {
            const isStaff = msg.sender.role !== "CLIENT";
            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl text-sm ${
                  isStaff
                    ? "bg-navy-900 text-white ml-16"
                    : "bg-white border border-gray-200 mr-16"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${isStaff ? "text-white/70" : "text-gray-500"}`}>
                    {msg.sender.name}
                    {isStaff && <span className="ml-1 opacity-50">• Staff</span>}
                  </span>
                  <span className={`text-xs ${isStaff ? "text-white/40" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
            placeholder="Reply to client..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
          <button
            onClick={sendReply}
            disabled={sending || !reply.trim()}
            className="px-6 py-3 bg-navy-900 text-white text-sm font-bold rounded-xl hover:bg-navy-800 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  // ── Main view ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-navy-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Client conversations and notifications.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("threads")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === "threads"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Conversations
          {unreadCount > 0 && (
            <span className="ml-2 bg-gold-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("notify")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            tab === "notify"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Send Notification
        </button>
      </div>

      {/* Threads */}
      {tab === "threads" && (
        loading ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : threads.length === 0 ? (
          <p className="text-gray-400 text-sm">No client conversations yet.</p>
        ) : (
          <div className="space-y-3">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => openThread(t.id)}
                className="w-full text-left bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-gold-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {t.hasUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-gold-500 flex-shrink-0" />
                      )}
                      <span className="font-serif font-bold text-navy-900 truncate">
                        {t.subject}
                      </span>
                      {t.status === "CLOSED" && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          Closed
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {t.user.name} · {t.user.email}
                      {t.debtAccount && (
                        <span className="font-mono ml-1 text-xs">#{t.debtAccount.accountNumber}</span>
                      )}
                    </p>
                    {t.messages[0] && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {t.messages[0].content}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                    {new Date(t.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )
      )}

      {/* Send Notification */}
      {tab === "notify" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-lg space-y-4">
          <p className="text-sm text-gray-500">
            Send a one-way notification to a client. They&apos;ll see it in their Messages tab.
          </p>

          {notifSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              Notification sent successfully.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
            >
              <option value="">Select a client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="e.g. Payment Plan Approved"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={3}
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              placeholder="Details for the client…"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <button
            onClick={sendNotification}
            disabled={notifSending || !selectedClient || !notifTitle.trim() || !notifBody.trim()}
            className="w-full bg-navy-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-navy-800 disabled:opacity-50 transition-colors"
          >
            {notifSending ? "Sending…" : "Send Notification"}
          </button>
        </div>
      )}
    </div>
  );
}
