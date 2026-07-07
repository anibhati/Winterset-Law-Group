import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Linking, Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active", IN_PLAN: "In Payment Plan",
  RESOLVED: "Resolved", DISPUTED: "Disputed",
};
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE:   { bg: "#fef9c3", text: "#854d0e" },
  IN_PLAN:  { bg: "#dbeafe", text: "#1e40af" },
  RESOLVED: { bg: "#dcfce7", text: "#166534" },
  DISPUTED: { bg: "#fee2e2", text: "#991b1b" },
};
const DEBT_TYPE_LABELS: Record<string, string> = {
  INCOME_TAX: "Income Tax", BUSINESS_TAX: "Business Tax", SALES_TAX: "Sales Tax",
  WITHHOLDING_TAX: "Withholding Tax", BWC: "BWC", UNEMPLOYMENT: "Unemployment",
  MEDICAID: "Medicaid", OTHER: "Other",
};

interface ActivePlan {
  status: string;
  frequency: string;
  installmentAmount: number;
  startDate: string;
}
interface DebtAccount {
  accountNumber: string;
  debtType: string;
  originalAmount: number;
  currentBalance: number;
  agency: string;
  status: string;
  planRequests: ActivePlan[];
}
interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  debtAccount: DebtAccount | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<UserProfile>("/api/mobile/account");
      setProfile(data);
    } catch (err) {
      // non-fatal — fall back to SecureStore user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function confirmLogout() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  }

  const debt = profile?.debtAccount;
  const activePlan = debt?.planRequests?.[0];
  const statusColor = debt ? (STATUS_COLORS[debt.status] ?? { bg: "#f3f4f6", text: "#374151" }) : null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Account</Text>

      {/* Debt Account */}
      {loading ? (
        <View style={[styles.card, styles.centered]}>
          <ActivityIndicator color={NAVY} />
        </View>
      ) : debt ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Debt Account</Text>
            <View style={[styles.badge, { backgroundColor: statusColor!.bg }]}>
              <Text style={[styles.badgeText, { color: statusColor!.text }]}>
                {STATUS_LABELS[debt.status] ?? debt.status}
              </Text>
            </View>
          </View>
          <Row label="Account #" value={debt.accountNumber} />
          <Row label="Debt Type" value={DEBT_TYPE_LABELS[debt.debtType] ?? debt.debtType} />
          <Row label="Agency" value={debt.agency} />
          <Row label="Original Amount" value={`$${debt.originalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
          <View style={[styles.row, styles.rowBorderTop]}>
            <Text style={styles.rowLabel}>Current Balance</Text>
            <Text style={styles.balance}>${debt.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
          </View>

          {activePlan && (
            <View style={styles.planSection}>
              <Text style={styles.planSectionTitle}>Payment Plan</Text>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Status</Text>
                <View style={[styles.badge, activePlan.status === "APPROVED" ? { backgroundColor: "#dcfce7" } : { backgroundColor: "#fef9c3" }]}>
                  <Text style={[styles.badgeText, activePlan.status === "APPROVED" ? { color: "#166534" } : { color: "#854d0e" }]}>
                    {activePlan.status === "APPROVED" ? "Approved" : "Pending Review"}
                  </Text>
                </View>
              </View>
              <Row label="Amount" value={`$${activePlan.installmentAmount.toFixed(2)} / ${activePlan.frequency.toLowerCase()}`} />
              <Row label="Start Date" value={new Date(activePlan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.card, { alignItems: "center", padding: 24 }]}>
          <Text style={styles.rowLabel}>No debt account linked yet.</Text>
        </View>
      )}

      {/* Profile */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile</Text>
        <Row label="Name" value={profile?.name ?? user?.name ?? "—"} />
        <Row label="Email" value={profile?.email ?? user?.email ?? "—"} />
        <Row label="Phone" value={profile?.phone ?? "—"} />
        <Row
          label="Member Since"
          value={profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : "—"}
        />
        <Text style={styles.updateNote}>
          To update your contact info, call us at{" "}
          <Text style={styles.phoneLink} onPress={() => Linking.openURL("tel:6144531200")}>
            614-453-1200
          </Text>.
        </Text>
      </View>

      {/* Quick actions */}
      <View style={styles.actionRow}>
        <View style={[styles.actionBtn, { backgroundColor: NAVY }]}>
          <Text style={styles.actionBtnTitle}>New Request</Text>
          <Text style={styles.actionBtnSub}>Payment plan or dispute</Text>
        </View>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: BRONZE }]}
          onPress={() => Linking.openURL("tel:6144531200")}
        >
          <Text style={styles.actionBtnTitle}>Schedule Call</Text>
          <Text style={styles.actionBtnSub}>Talk to an attorney</Text>
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Legal</Text>
        <TouchableOpacity style={styles.legalRow} onPress={() => Linking.openURL("https://winterset-law-group.vercel.app/legal/privacy")}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.legalRow} onPress={() => Linking.openURL("https://winterset-law-group.vercel.app/legal/terms")}>
          <Text style={styles.legalLink}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={confirmLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 100 },
  centered: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: NAVY, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6 },
  rowBorderTop: { borderTopWidth: 1, borderTopColor: "#f3f4f6", marginTop: 4, paddingTop: 10 },
  rowLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#111827", textAlign: "right", flex: 1 },
  balance: { fontSize: 20, fontWeight: "700", color: NAVY },
  planSection: { borderTopWidth: 1, borderTopColor: "#f3f4f6", marginTop: 8, paddingTop: 12 },
  planSectionTitle: { fontSize: 13, fontWeight: "700", color: NAVY, marginBottom: 8 },
  updateNote: { fontSize: 12, color: "#9ca3af", marginTop: 10, lineHeight: 18 },
  phoneLink: { color: NAVY, fontWeight: "700", textDecorationLine: "underline" },
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  actionBtn: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
  actionBtnTitle: { color: "#fff", fontWeight: "700", fontSize: 12, marginBottom: 2 },
  actionBtnSub: { color: "rgba(255,255,255,0.6)", fontSize: 10, textAlign: "center" },
  legalRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  legalLink: { fontSize: 14, color: NAVY, fontWeight: "500" },
  signOutBtn: { backgroundColor: "#fff", borderRadius: 14, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: "#fee2e2", marginBottom: 12 },
  signOutText: { color: "#b91c1c", fontWeight: "700", fontSize: 15 },
});
