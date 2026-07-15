import React, { useState, useCallback, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, Alert, KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { apiFetch, ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

interface ThreadSummary {
  id: string;
  subject: string;
  status: string;
  hasUnread: boolean;
  updatedAt: string;
  messages: { content: string; createdAt: string }[];
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

interface Thread {
  id: string;
  subject: string;
  status: string;
  messages: Message[];
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "thread" | "new">("list");
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const loadThreads = useCallback(async () => {
    try {
      const data = await apiFetch<{ threads: ThreadSummary[] }>("/api/mobile/messages");
      setThreads(data.threads);
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    setView("list");
    loadThreads();
  }, [loadThreads]));

  async function openThread(id: string) {
    try {
      const data = await apiFetch<Thread>(`/api/mobile/messages/${id}`);
      setActiveThread(data);
      setReplyText("");
      setView("thread");
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 100);
    } catch {
      Alert.alert("Error", "Failed to load conversation.");
    }
  }

  async function sendReply() {
    if (!replyText.trim() || !activeThread) return;
    setSending(true);
    try {
      await apiFetch(`/api/mobile/messages/${activeThread.id}`, {
        method: "POST",
        body: { message: replyText.trim() },
      });
      setReplyText("");
      const data = await apiFetch<Thread>(`/api/mobile/messages/${activeThread.id}`);
      setActiveThread(data);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  async function createThread() {
    if (!newSubject.trim() || !newMessage.trim()) {
      Alert.alert("Required", "Please enter a subject and message.");
      return;
    }
    setSending(true);
    try {
      await apiFetch("/api/mobile/messages", {
        method: "POST",
        body: { subject: newSubject.trim(), message: newMessage.trim() },
      });
      setNewSubject("");
      setNewMessage("");
      await loadThreads();
      setView("list");
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  if (view === "list") {
    return (
      <View style={styles.flex}>
        <View style={styles.listHeader}>
          <Text style={styles.heading}>Messages</Text>
          <TouchableOpacity style={styles.newBtn} onPress={() => setView("new")}>
            <Text style={styles.newBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={NAVY} size="large" />
          </View>
        ) : threads.length === 0 ? (
          <View style={styles.centered}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No messages yet. Send us a message and we'll respond within 1 business day.</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => setView("new")}>
                <Text style={styles.emptyBtnText}>Send a Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView style={styles.flex} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
            {threads.map((t) => {
              const lastMsg = t.messages[0];
              return (
                <TouchableOpacity key={t.id} style={styles.threadCard} onPress={() => openThread(t.id)}>
                  <View style={styles.threadTop}>
                    <Text style={[styles.threadSubject, t.hasUnread && styles.threadSubjectUnread]} numberOfLines={1}>
                      {t.subject}
                    </Text>
                    {t.hasUnread && <View style={styles.unreadDot} />}
                  </View>
                  {lastMsg && <Text style={styles.threadPreview} numberOfLines={2}>{lastMsg.content}</Text>}
                  <Text style={styles.threadDate}>
                    {new Date(t.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" · "}
                    <Text style={t.status === "OPEN" ? { color: "#166534" } : { color: "#6b7280" }}>
                      {t.status === "OPEN" ? "Open" : "Closed"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }

  if (view === "new") {
    return (
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.listHeader}>
          <TouchableOpacity onPress={() => setView("list")}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>New Message</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView style={styles.flex} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              value={newSubject}
              onChangeText={setNewSubject}
              placeholder="e.g. Question about my balance"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            <Text style={[styles.inputLabel, { marginTop: 16 }]}>Message</Text>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Write your message here..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={6}
              style={styles.textarea}
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={createThread} disabled={sending}>
            {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Send Message</Text>}
          </TouchableOpacity>
          <Text style={styles.legalNote}>We typically respond within 1 business day.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (view === "thread" && activeThread) {
    return (
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <View style={styles.listHeader}>
          <TouchableOpacity onPress={() => { setView("list"); loadThreads(); }}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.threadHeaderTitle} numberOfLines={1}>{activeThread.subject}</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={{ padding: 16, paddingBottom: 16 }}>
          {activeThread.messages.map((msg) => {
            const isMe = msg.sender.id === user?.id;
            const isStaff = msg.sender.role === "STAFF" || msg.sender.role === "ATTORNEY";
            return (
              <View key={msg.id} style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                {!isMe && <Text style={styles.bubbleSender}>{msg.sender.name}{isStaff ? " · WLG" : ""}</Text>}
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.content}</Text>
                <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {" · "}
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
              </View>
            );
          })}
          {activeThread.status === "CLOSED" && (
            <View style={styles.closedNote}>
              <Text style={styles.closedNoteText}>This conversation has been closed by our team.</Text>
            </View>
          )}
        </ScrollView>
        {activeThread.status !== "CLOSED" && (
          <View style={styles.replyBar}>
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              style={styles.replyInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!replyText.trim() || sending) && styles.sendBtnDisabled]}
              onPress={sendReply}
              disabled={!replyText.trim() || sending}
            >
              {sending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendBtnText}>Send</Text>}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f9fafb" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: "#f9fafb", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  heading: { fontSize: 20, fontWeight: "700", color: NAVY },
  newBtn: { backgroundColor: NAVY, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  newBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  backBtn: { color: BRONZE, fontWeight: "600", fontSize: 14, width: 60 },
  threadHeaderTitle: { fontSize: 15, fontWeight: "700", color: NAVY, flex: 1, textAlign: "center" },
  threadCard: { backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  threadTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  threadSubject: { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1 },
  threadSubjectUnread: { color: NAVY, fontWeight: "700" },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: BRONZE, marginLeft: 8 },
  threadPreview: { fontSize: 13, color: "#6b7280", marginBottom: 6, lineHeight: 18 },
  threadDate: { fontSize: 11, color: "#9ca3af" },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#e5e7eb", padding: 32, alignItems: "center" },
  emptyText: { color: "#9ca3af", fontSize: 14, textAlign: "center", marginBottom: 16, lineHeight: 20 },
  emptyBtn: { backgroundColor: NAVY, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  inputLabel: { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15, color: "#111827" },
  textarea: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 14, color: "#111827", minHeight: 140 },
  submitBtn: { backgroundColor: NAVY, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  legalNote: { fontSize: 11, color: "#9ca3af", textAlign: "center" },
  bubble: { marginBottom: 12, maxWidth: "80%" },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: NAVY, borderRadius: 16, borderBottomRightRadius: 4, padding: 12 },
  bubbleThem: { alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bubbleSender: { fontSize: 11, fontWeight: "700", color: BRONZE, marginBottom: 4 },
  bubbleText: { fontSize: 14, color: "#111827", lineHeight: 20 },
  bubbleTextMe: { color: "#fff" },
  bubbleTime: { fontSize: 10, color: "#9ca3af", marginTop: 4 },
  bubbleTimeMe: { color: "rgba(255,255,255,0.5)", textAlign: "right" },
  closedNote: { alignItems: "center", paddingVertical: 12 },
  closedNoteText: { fontSize: 12, color: "#9ca3af", fontStyle: "italic" },
  replyBar: { flexDirection: "row", alignItems: "flex-end", padding: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e5e7eb", gap: 8 },
  replyInput: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#111827", maxHeight: 100 },
  sendBtn: { backgroundColor: NAVY, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10 },
  sendBtnDisabled: { backgroundColor: "#d1d5db" },
  sendBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
