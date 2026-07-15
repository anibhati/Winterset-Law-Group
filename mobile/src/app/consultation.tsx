import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { apiFetch, ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

const TOPICS = [
  { label: "Payment Plan", value: "PAYMENT_PLAN" },
  { label: "Dispute", value: "DISPUTE" },
  { label: "General Inquiry", value: "GENERAL_INQUIRY" },
  { label: "Other", value: "OTHER" },
];

const TIME_SLOTS = [
  "8:30 AM – 9:30 AM",
  "9:30 AM – 10:30 AM",
  "10:30 AM – 11:30 AM",
  "11:30 AM – 12:30 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
];

const TOPIC_LABELS: Record<string, string> = {
  PAYMENT_PLAN: "Payment Plan",
  DISPUTE: "Dispute",
  GENERAL_INQUIRY: "General Inquiry",
  OTHER: "Other",
};

interface ExistingConsultation {
  id: string;
  topic: string;
  preferredDate: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

export default function ConsultationScreen() {
  const [existing, setExisting] = useState<ExistingConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("PAYMENT_PLAN");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ consultation: ExistingConsultation | null }>("/api/mobile/consultation");
      setExisting(data.consultation);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit() {
    if (!phone.trim()) { Alert.alert("Phone required", "Please enter a callback phone number."); return; }
    if (!preferredDate.trim()) { Alert.alert("Date required", "Please enter your preferred date (e.g. July 25, 2026)."); return; }
    if (!timeSlot) { Alert.alert("Time slot required", "Please select a preferred time."); return; }
    setSubmitting(true);
    try {
      await apiFetch("/api/mobile/consultation", {
        method: "POST",
        body: { phone: phone.trim(), topic, preferredDate, timeSlot, notes: notes.trim() || undefined },
      });
      setSubmitted(true);
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator color={NAVY} size="large" /></View>;
  }

  if (existing || submitted) {
    const date = existing?.preferredDate
      ? new Date(existing.preferredDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      : preferredDate;
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Schedule a Call</Text>
        <View style={styles.confirmedCard}>
          <Text style={styles.confirmedTitle}>
            {existing?.status === "CONFIRMED" ? "Call Confirmed" : "Request Received"}
          </Text>
          <Text style={styles.confirmedBody}>
            {existing?.status === "CONFIRMED"
              ? `Your call is confirmed for ${date} during the ${existing?.timeSlot ?? timeSlot} window.`
              : `We received your request for ${date}. Our team will confirm within 1 business day.`}
          </Text>
          {existing && (
            <View style={styles.confirmedDetail}>
              <Text style={styles.confirmedDetailLabel}>Topic</Text>
              <Text style={styles.confirmedDetailValue}>{TOPIC_LABELS[existing.topic] ?? existing.topic}</Text>
            </View>
          )}
          {existing && (
            <View style={styles.confirmedDetail}>
              <Text style={styles.confirmedDetailLabel}>Time</Text>
              <Text style={styles.confirmedDetailValue}>{existing.timeSlot}</Text>
            </View>
          )}
          <Text style={styles.confirmedNote}>To reschedule or cancel, call us at <Text style={styles.phone}>614-453-1200</Text>.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Schedule a Call</Text>
      <Text style={styles.subheading}>Request a callback from one of our attorneys. Available Monday – Friday, 8:30 AM – 4:30 PM.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What do you need help with?</Text>
        {TOPICS.map((t) => (
          <TouchableOpacity key={t.value} style={[styles.optionRow, topic === t.value && styles.optionRowActive]} onPress={() => setTopic(t.value)}>
            <View style={[styles.radio, topic === t.value && styles.radioActive]}>
              {topic === t.value && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.optionText, topic === t.value && styles.optionTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Callback Number</Text>
        <TextInput value={phone} onChangeText={setPhone} placeholder="(614) 555-0100" placeholderTextColor="#9ca3af" keyboardType="phone-pad" style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferred Date</Text>
        <TextInput value={preferredDate} onChangeText={setPreferredDate} placeholder="e.g. July 25, 2026" placeholderTextColor="#9ca3af" style={styles.input} />
        <Text style={styles.inputHint}>We'll do our best to accommodate your request.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferred Time</Text>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity key={slot} style={[styles.optionRow, timeSlot === slot && styles.optionRowActive]} onPress={() => setTimeSlot(slot)}>
            <View style={[styles.radio, timeSlot === slot && styles.radioActive]}>
              {timeSlot === slot && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.optionText, timeSlot === slot && styles.optionTextActive]}>{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Additional Notes <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Anything you'd like us to know before the call..." placeholderTextColor="#9ca3af" multiline numberOfLines={3} style={styles.textarea} textAlignVertical="top" />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Request Callback</Text>}
      </TouchableOpacity>
      <Text style={styles.legalNote}>Submitting this form does not guarantee a specific time. Our team will contact you to confirm.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 4 },
  subheading: { fontSize: 13, color: "#6b7280", marginBottom: 16, lineHeight: 18 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: NAVY, marginBottom: 12 },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderRadius: 10, paddingHorizontal: 4 },
  optionRowActive: { backgroundColor: "#f0f4f8" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#d1d5db", alignItems: "center", justifyContent: "center", marginRight: 12 },
  radioActive: { borderColor: NAVY },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: NAVY },
  optionText: { fontSize: 14, color: "#374151" },
  optionTextActive: { color: NAVY, fontWeight: "600" },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15, color: "#111827" },
  inputHint: { fontSize: 11, color: "#9ca3af", marginTop: 6 },
  textarea: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 14, color: "#111827", minHeight: 80 },
  optional: { fontWeight: "400", color: "#9ca3af" },
  submitBtn: { backgroundColor: BRONZE, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  legalNote: { fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 16 },
  confirmedCard: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#86efac", borderRadius: 16, padding: 20 },
  confirmedTitle: { fontSize: 16, fontWeight: "700", color: "#166534", marginBottom: 8 },
  confirmedBody: { fontSize: 13, color: "#166534", lineHeight: 20, marginBottom: 12 },
  confirmedDetail: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: "#bbf7d0" },
  confirmedDetailLabel: { fontSize: 13, color: "#166534" },
  confirmedDetailValue: { fontSize: 13, fontWeight: "600", color: "#166534" },
  confirmedNote: { fontSize: 12, color: "#166534", marginTop: 12, lineHeight: 18 },
  phone: { fontWeight: "700", textDecorationLine: "underline" },
});
