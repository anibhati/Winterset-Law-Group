import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";

const REASONS = [
  { label: "Amount is incorrect", value: "WRONG_AMOUNT" },
  { label: "Debt is not mine", value: "NOT_MY_DEBT" },
  { label: "Already paid", value: "ALREADY_PAID" },
  { label: "Identity theft / fraud", value: "IDENTITY_THEFT" },
  { label: "Other", value: "OTHER" },
];

interface Account {
  accountNumber: string;
  currentBalance: number;
}

interface PendingDispute {
  createdAt: string;
}

export default function DisputeScreen() {
  const [account, setAccount] = useState<Account | null>(null);
  const [pending, setPending] = useState<PendingDispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ account: Account | null; dispute: PendingDispute | null }>("/api/mobile/dashboard");
      setAccount(data.account);
      if (data.dispute) setPending(data.dispute);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit() {
    if (!reason) {
      Alert.alert("Select a reason", "Please choose a reason for your dispute.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Description required", "Please provide a brief description of your dispute.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/mobile/dispute", {
        method: "POST",
        body: { reason, description: description.trim() },
      });
      setSubmitted(true);
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={NAVY} size="large" />
      </View>
    );
  }

  if (!account) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>File a Dispute</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No account linked yet. Contact us to get started.</Text>
        </View>
      </ScrollView>
    );
  }

  if (pending || submitted) {
    const date = pending?.createdAt
      ? new Date(pending.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "just now";
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>File a Dispute</Text>
        <View style={styles.pendingCard}>
          <Text style={styles.pendingTitle}>Dispute under review</Text>
          <Text style={styles.pendingBody}>
            Our team is reviewing your dispute{pending ? ` submitted on ${date}` : ""}. We'll respond within 3–5 business days.
          </Text>
          <Text style={styles.pendingBody}>
            Questions? Call us at <Text style={styles.phoneLink}>614-453-1200</Text>.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>File a Dispute</Text>
      <Text style={styles.subheading}>Dispute the amount, ownership, or validity of your debt.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Account #</Text>
          <Text style={styles.rowValue}>{account.accountNumber}</Text>
        </View>
        <View style={[styles.row, styles.rowBorderTop]}>
          <Text style={styles.rowLabel}>Balance</Text>
          <Text style={styles.balance}>${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reason for Dispute</Text>
        {REASONS.map((r) => (
          <TouchableOpacity
            key={r.value}
            style={[styles.reasonRow, reason === r.value && styles.reasonRowActive]}
            onPress={() => setReason(r.value)}
          >
            <View style={[styles.radio, reason === r.value && styles.radioActive]}>
              {reason === r.value && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.reasonText, reason === r.value && styles.reasonTextActive]}>
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your dispute in detail..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          style={styles.textarea}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitBtnText}>Submit Dispute</Text>}
      </TouchableOpacity>

      <Text style={styles.legalNote}>
        Filing a dispute does not pause collection activity. Our team will review your claim and respond within 3–5 business days.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 4 },
  subheading: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: NAVY, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  rowBorderTop: { borderTopWidth: 1, borderTopColor: "#f3f4f6", marginTop: 4, paddingTop: 10 },
  rowLabel: { fontSize: 13, color: "#6b7280" },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  balance: { fontSize: 20, fontWeight: "700", color: NAVY },
  reasonRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderRadius: 10, paddingHorizontal: 4 },
  reasonRowActive: { backgroundColor: "#f0f4f8" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#d1d5db", alignItems: "center", justifyContent: "center", marginRight: 12 },
  radioActive: { borderColor: NAVY },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: NAVY },
  reasonText: { fontSize: 14, color: "#374151" },
  reasonTextActive: { color: NAVY, fontWeight: "600" },
  textarea: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 14, color: "#111827", minHeight: 100 },
  submitBtn: { backgroundColor: "#b91c1c", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 4, marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  legalNote: { fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 16 },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#e5e7eb", padding: 32, alignItems: "center" },
  emptyText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
  pendingCard: { backgroundColor: "#fefce8", borderWidth: 1, borderColor: "#fde68a", borderRadius: 16, padding: 20 },
  pendingTitle: { fontSize: 15, fontWeight: "700", color: "#854d0e", marginBottom: 8 },
  pendingBody: { fontSize: 13, color: "#92400e", lineHeight: 20, marginBottom: 4 },
  phoneLink: { fontWeight: "700", textDecorationLine: "underline" },
});
