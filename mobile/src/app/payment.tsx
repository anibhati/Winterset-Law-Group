import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

const FREQUENCIES = [
  { label: "Weekly", value: "WEEKLY" },
  { label: "Bi-Weekly", value: "BIWEEKLY" },
  { label: "Monthly", value: "MONTHLY" },
];

const DEBT_TYPE_LABELS: Record<string, string> = {
  INCOME_TAX: "Income Tax", BUSINESS_TAX: "Business Tax", SALES_TAX: "Sales Tax",
  WITHHOLDING_TAX: "Withholding Tax", BWC: "BWC", UNEMPLOYMENT: "Unemployment",
  MEDICAID: "Medicaid", OTHER: "Other",
};

interface Account {
  accountNumber: string;
  debtType: string;
  currentBalance: number;
}

interface PendingPlan {
  createdAt: string;
}

export default function PaymentScreen() {
  const [account, setAccount] = useState<Account | null>(null);
  const [pending, setPending] = useState<PendingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [frequency, setFrequency] = useState("MONTHLY");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ account: Account | null; planRequest: PendingPlan | null }>("/api/mobile/dashboard");
      setAccount(data.account);
      if (data.planRequest) setPending(data.planRequest);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit() {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid installment amount.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/api/mobile/payment-plan", {
        method: "POST",
        body: { frequency, installmentAmount: parsed },
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
        <Text style={styles.heading}>Set Up a Payment Plan</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>You haven't linked a debt account yet. Contact us to get started.</Text>
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
        <Text style={styles.heading}>Set Up a Payment Plan</Text>
        <View style={styles.pendingCard}>
          <Text style={styles.pendingTitle}>Plan under review</Text>
          <Text style={styles.pendingBody}>
            Our team is reviewing your payment plan request{pending ? ` submitted on ${date}` : ""}. We'll contact you within 1–2 business days.
          </Text>
          <Text style={styles.pendingBody}>
            To make changes, call us at{" "}
            <Text style={styles.phoneLink}>614-453-1200</Text>.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Set Up a Payment Plan</Text>
      <Text style={styles.subheading}>Choose a frequency and amount that works for your budget.</Text>

      {/* Balance card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Balance</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Account #</Text>
          <Text style={styles.rowValue}>{account.accountNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Type</Text>
          <Text style={styles.rowValue}>{DEBT_TYPE_LABELS[account.debtType] ?? account.debtType}</Text>
        </View>
        <View style={[styles.row, styles.rowBorderTop]}>
          <Text style={styles.rowLabel}>Balance Due</Text>
          <Text style={styles.balance}>${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
        </View>
      </View>

      {/* Frequency selector */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Frequency</Text>
        <View style={styles.freqRow}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.freqBtn, frequency === f.value && styles.freqBtnActive]}
              onPress={() => setFrequency(f.value)}
            >
              <Text style={[styles.freqBtnText, frequency === f.value && styles.freqBtnTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amount input */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Installment Amount</Text>
        <View style={styles.amountRow}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            style={styles.amountInput}
          />
        </View>
        <Text style={styles.amountHint}>
          Per {FREQUENCIES.find((f) => f.value === frequency)?.label.toLowerCase() ?? "payment"} payment
        </Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitBtnText}>Submit Request</Text>}
      </TouchableOpacity>

      <Text style={styles.legalNote}>
        Submitting this request does not guarantee approval. Our team will review and contact you within 1–2 business days.
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
  balance: { fontSize: 22, fontWeight: "700", color: NAVY },
  freqRow: { flexDirection: "row", gap: 8 },
  freqBtn: { flex: 1, borderRadius: 10, borderWidth: 1.5, borderColor: "#e5e7eb", paddingVertical: 10, alignItems: "center" },
  freqBtnActive: { borderColor: NAVY, backgroundColor: NAVY },
  freqBtnText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  freqBtnTextActive: { color: "#fff" },
  amountRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 12, marginBottom: 6 },
  dollarSign: { fontSize: 18, color: "#9ca3af", marginRight: 4 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: "700", color: NAVY, paddingVertical: 12 },
  amountHint: { fontSize: 12, color: "#9ca3af" },
  submitBtn: { backgroundColor: BRONZE, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 4, marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  legalNote: { fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 16 },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#e5e7eb", padding: 32, alignItems: "center" },
  emptyText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
  pendingCard: { backgroundColor: "#fefce8", borderWidth: 1, borderColor: "#fde68a", borderRadius: 16, padding: 20 },
  pendingTitle: { fontSize: 15, fontWeight: "700", color: "#854d0e", marginBottom: 8 },
  pendingBody: { fontSize: 13, color: "#92400e", lineHeight: 20, marginBottom: 4 },
  phoneLink: { fontWeight: "700", textDecorationLine: "underline" },
});
