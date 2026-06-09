// src/app/(dashboard)/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

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

interface Notification {
  id: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

type Tab = "threads" | "notifications";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("threads");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // New thread form
  const [showNewThread, setShowNewThread] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Thread detail view
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<
    {
      id: string;
      content: string;
      createdAt: string;
      sender: { id: string; name: string; role: string };
    }[]
  >([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetchThreads();
    fetchNotifications();
  }, []);

  async function fetchThreads() {
    try {
      const res = await fetch("/api/messages/threads");
      if (res.ok) setThreads(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  async function createThread() {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) {
        setSubject("");
        setMessage("");
        setShowNewThread(false);
        fetchThreads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function openThread(threadId: string) {
    setActiveThread(threadId);
    try {
      const res = await fetch(`/api/messages/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setThreadMessages(data.messages);
        // Refresh thread list to clear unread indicator
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

  async function markNotificationRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const unreadNotifs = notifications.filter((n) => !n.readAt).length;

  // ── Thread detail view ──────────────────────────────────────────
  if (activeThread) {
    const thread = threads.find((t) => t.id === activeThread);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setActiveThread(null)}
          className="text-sm text-[#B1784D] hover:underline mb-4"
        >
          ← Back to messages
        </button>
        <h2 className="text-xl font-semibold text-[#10283B] mb-6">
          {thread?.subject ?? "Thread"}
        </h2>

        <div className="space-y-4 mb-6">
          {threadMessages.map((msg) => {
            const isMe = msg.sender.id === session?.user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  isMe
                    ? "bg-[#10283B] text-white ml-12"
                    : "bg-gray-100 text-gray-900 mr-12"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium opacity-70">
                    {msg.sender.name}
                    {msg.sender.role !== "CLIENT" && (
                      <span className="ml-1 opacity-50">• Staff</span>
                    )}
                  </span>
                  <span className="text-xs opacity-50">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
            placeholder="Type a reply..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B1784D]/30 focus:border-[#B1784D]"
          />
          <button
            onClick={sendReply}
            disabled={sending || !reply.trim()}
            className="px-6 py-3 bg-[#B1784D] text-white text-sm font-medium rounded-lg hover:bg-[#9A6640] disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  // ── Main list view ──────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#10283B]">Messages</h1>
        <button
          onClick={() => setShowNewThread(true)}
          className="px-4 py-2 bg-[#B1784D] text-white text-sm font-medium rounded-lg hover:bg-[#9A6640] transition-colors"
        >
          New Message
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setTab("threads")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "threads"
              ? "bg-white text-[#10283B] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Conversations
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors relative ${
            tab === "notifications"
              ? "bg-white text-[#10283B] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Notifications
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifs}
            </span>
          )}
        </button>
      </div>

      {/* New thread form */}
      {showNewThread && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border border-gray-200 rounded-lg p-4 mb-6 space-y-3"
        >
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B1784D]/30 focus:border-[#B1784D]"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#B1784D]/30 focus:border-[#B1784D]"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowNewThread(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={createThread}
              disabled={sending || !subject.trim() || !message.trim()}
              className="px-4 py-2 bg-[#10283B] text-white text-sm font-medium rounded-lg hover:bg-[#0d2033] disabled:opacity-50 transition-colors"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-12">Loading...</p>
      ) : tab === "threads" ? (
        threads.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">
            No conversations yet
          </p>
        ) : (
          <div className="space-y-2">
            {threads.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => openThread(t.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-[#B1784D]/30 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {t.hasUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#B1784D] flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-[#10283B] truncate">
                        {t.subject}
                      </span>
                    </div>
                    {t.messages[0] && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {t.messages[0].content}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                    {new Date(t.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )
      ) : notifications.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">
          No notifications
        </p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => !n.readAt && markNotificationRead(n.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                n.readAt
                  ? "border-gray-100 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-[#B1784D]/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {!n.readAt && (
                      <span className="w-2 h-2 rounded-full bg-[#B1784D] flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        n.readAt ? "text-gray-500" : "text-[#10283B]"
                      }`}
                    >
                      {n.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{n.body}</p>
                </div>
                <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
