import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Linking,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING:   { bg: "#fef9c3", text: "#854d0e" },
  APPROVED:  { bg: "#dcfce7", text: "#166534" },
  REJECTED:  { bg: "#fee2e2", text: "#991b1b" },
  ACTIVE:    { bg: "#dbeafe", text: "#1e40af" },
  IN_PLAN:   { bg: "#e0e7ff", text: "#3730a3" },
  RESOLVED:  { bg: "#dcfce7", text: "#166534" },
  DISPUTED:  { bg: "#ffedd5", text: "#9a3412" },
  CONFIRMED: { bg: "#dcfce7", text: "#166534" },
  CANCELLED: { bg: "#fee2e2", text: "#991b1b" },
};

interface Account {
  accountNumber: string;
  debtType: string;
  agency: string;
  currentBalance: number;
  status: string;
}

interface PlanRequest {
  frequency: string;
  installmentAmount: number;
  status: string;
  staffNotes?: string | null;
  createdAt: string;
}

interface Dispute {
  reason: string;
  status: string;
}

interface Consultation {
  preferredDate: string;
  timeSlot: string;
  status: string;
}

interface DashboardData {
  account: Account | null;
  planRequest: PlanRequest | null;
  dispute: Dispute | null;
  consultation: Consultation | null;
}

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? { bg: "#f3f4f6", text: "#374151" };
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>
        {status.replace(/_/g, " ")}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch<DashboardData>("/api/mobile/dashboard");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={NAVY} size="large" />
      </View>
    );
  }

  const { account, planRequest, dispute, consultation } = data ?? {};

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NAVY} />}
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingLabel}>Welcome back,</Text>
        <Text style={styles.greetingName}>{user?.name?.split(" ")[0] ?? "there"}</Text>
        <Text style={styles.greetingSubtitle}>Here's the status of your account with Winterset Law Group.</Text>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* No account */}
      {!account && !error && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No account linked yet. Contact us to get started.</Text>
        </View>
      )}

      {/* Account card */}
      {account && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Account</Text>
            <StatusBadge status={account.status} />
          </View>
          <View style={styles.row}><Text style={styles.rowLabel}>Account #</Text><Text style={styles.rowValue}>{account.accountNumber}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Type</Text><Text style={styles.rowValue}>{account.debtType.replace(/_/g, " ")}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Agency</Text><Text style={[styles.rowValue, { maxWidth: "60%" }]} numberOfLines={2}>{account.agency}</Text></View>
          <View style={[styles.row, styles.rowBorderTop]}>
            <Text style={styles.rowLabel}>Balance Due</Text>
            <Text style={styles.balance}>${account.currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>
      )}

      {/* Payment plan */}
      {planRequest && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Plan</Text>
          <View style={[styles.row, { marginTop: 8 }]}>
            <StatusBadge status={planRequest.status === "PENDING" ? "PENDING" : planRequest.status} />
            <Text style={styles.dateText}>
              Submitted {new Date(planRequest.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </View>
          <View style={styles.row}><Text style={styles.rowLabel}>Frequency</Text><Text style={styles.rowValue}>{planRequest.frequency.toLowerCase()}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Amount</Text><Text style={styles.rowValue}>${planRequest.installmentAmount.toFixed(2)}/payment</Text></View>
          {planRequest.status === "PENDING" && (
            <Text style={styles.mutedNote}>Our team is reviewing your request. We'll contact you within 1–2 business days.</Text>
          )}
          {planRequest.staffNotes && (
            <View style={styles.noteCard}>
              <Text style={styles.noteText}><Text style={{ fontWeight: "600" }}>Note from our team: </Text>{planRequest.staffNotes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Consultation */}
      {consultation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scheduled Call</Text>
          <View style={[styles.row, { marginTop: 8 }]}>
            <View>
              <Text style={styles.rowValue}>
                {new Date(consultation.preferredDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </Text>
              <Text style={styles.rowLabel}>{consultation.timeSlot}</Text>
            </View>
            <StatusBadge status={consultation.status} />
          </View>
        </View>
      )}

      {/* Dispute */}
      {dispute && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dispute</Text>
            <StatusBadge status={dispute.status} />
          </View>
          <Text style={styles.rowLabel}>{dispute.reason.replace(/_/g, " ")}</Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: NAVY }]}>
          <Text style={styles.actionBtnTitle}>Set Up Plan</Text>
          <Text style={styles.actionBtnSub}>Start a new request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: BRONZE }]}>
          <Text style={styles.actionBtnTitle}>Talk to Us</Text>
          <Text style={styles.actionBtnSub}>Schedule a call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#b91c1c" }]}>
          <Text style={styles.actionBtnTitle}>File Dispute</Text>
          <Text style={styles.actionBtnSub}>Contest your debt</Text>
        </TouchableOpacity>
      </View>

      {/* Call us */}
      <TouchableOpacity style={styles.callCard} onPress={() => Linking.openURL("tel:6144531200")}>
        <View>
          <Text style={styles.callTitle}>Need immediate help?</Text>
          <Text style={styles.callHours}>Monday – Friday, 8:30 AM – 4:30 PM</Text>
        </View>
        <View style={styles.callBtn}>
          <Text style={styles.callBtnText}>614-453-1200</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  greeting: { marginBottom: 16 },
  greetingLabel: { fontSize: 14, color: "#6b7280" },
  greetingName: { fontSize: 26, fontWeight: "700", color: NAVY },
  greetingSubtitle: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: NAVY },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 5 },
  rowBorderTop: { borderTopWidth: 1, borderTopColor: "#f3f4f6", marginTop: 4, paddingTop: 10 },
  rowLabel: { fontSize: 13, color: "#6b7280" },
  rowValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  balance: { fontSize: 22, fontWeight: "700", color: NAVY },
  dateText: { fontSize: 12, color: "#9ca3af" },
  mutedNote: { fontSize: 12, color: "#9ca3af", marginTop: 8 },
  noteCard: { backgroundColor: "#eff6ff", borderRadius: 10, padding: 10, marginTop: 8 },
  noteText: { fontSize: 12, color: "#1e40af" },
  emptyCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#e5e7eb", padding: 32, alignItems: "center", marginBottom: 12 },
  emptyText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
  errorCard: { backgroundColor: "#fee2e2", borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { color: "#991b1b", fontSize: 13 },
  actionRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  actionBtn: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
  actionBtnTitle: { color: "#fff", fontWeight: "700", fontSize: 12, marginBottom: 2 },
  actionBtnSub: { color: "rgba(255,255,255,0.6)", fontSize: 10 },
  callCard: { backgroundColor: "#f3f4f6", borderRadius: 16, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  callTitle: { fontSize: 13, fontWeight: "600", color: NAVY },
  callHours: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  callBtn: { backgroundColor: NAVY, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
