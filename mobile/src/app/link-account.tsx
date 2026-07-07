import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

const DEBT_TYPE_LABELS: Record<string, string> = {
  INCOME_TAX: "Income Tax", BUSINESS_TAX: "Business Tax", SALES_TAX: "Sales Tax",
  WITHHOLDING_TAX: "Withholding Tax", BWC: "BWC", UNEMPLOYMENT: "Unemployment",
  MEDICAID: "Medicaid", OTHER: "Other",
};

interface LookupResult {
  accountNumber: string;
  debtorName: string;
  debtType: string;
  currentBalance: number;
  agency: string;
  claimed: boolean;
}

export default function LinkAccountScreen() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [last4Ssn, setLast4Ssn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function handleLookup() {
    setError(null);
    if (!accountNumber.trim() || !lastName.trim() || !/^\d{4}$/.test(last4Ssn)) {
      setError("Please fill in your account number, last name, and 4-digit SSN.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch<LookupResult>("/api/lookup", {
        method: "POST",
        body: { accountNumber: accountNumber.trim(), lastName: lastName.trim(), last4Ssn },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.heading}>Account Linked</Text>
        <Text style={styles.subheading}>Your debt account is now connected to your profile.</Text>

        <View style={styles.card}>
          <View style={styles.row}><Text style={styles.rowLabel}>Account #</Text><Text style={styles.rowValue}>{result.accountNumber}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Type</Text><Text style={styles.rowValue}>{DEBT_TYPE_LABELS[result.debtType] ?? result.debtType}</Text></View>
          <View style={[styles.row, styles.rowBorderTop]}>
            <Text style={styles.rowLabel}>Balance Due</Text>
            <Text style={styles.balance}>${result.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => router.replace("/dashboard")}>
          <Text style={styles.submitBtnText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Find Your Account</Text>
      <Text style={styles.subheading}>Enter the account number from your letter and your last name.</Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Account Number</Text>
        <TextInput
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="e.g. WLG-2026-001"
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
          style={styles.input}
        />

        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Your last name"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />

        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Last 4 of SSN</Text>
        <TextInput
          value={last4Ssn}
          onChangeText={(t) => setLast4Ssn(t.replace(/\D/g, "").slice(0, 4))}
          placeholder="••••"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.submitBtn} onPress={handleLookup} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitBtnText}>Find My Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert("Call Us", "614-453-1200")}>
        <Text style={styles.helpText}>Don't have your account number? Call us for help.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 100, alignItems: "stretch" },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 4, textAlign: "center" },
  subheading: { fontSize: 13, color: "#6b7280", marginBottom: 20, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  inputLabel: { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15, color: "#111827" },
  error: { color: "#dc2626", fontSize: 13, marginBottom: 12, textAlign: "center" },
  submitBtn: { backgroundColor: NAVY, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  helpText: { fontSize: 12, color: "#9ca3af", textAlign: "center", textDecorationLine: "underline" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  rowBorderTop: { borderTopWidth: 1, borderTopColor: "#f3f4f6", marginTop: 4, paddingTop: 10 },
  rowLabel: { fontSize: 13, color: "#6b7280" },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  balance: { fontSize: 20, fontWeight: "700", color: NAVY },
  successIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#dcfce7", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 16 },
  successIconText: { fontSize: 32, color: "#166534" },
});
