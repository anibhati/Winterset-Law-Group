import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { apiFetch, ApiError } from "../../api/client";

const NAVY = "#10283B";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      Alert.alert("Email required", "Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim().toLowerCase() },
        skipAuth: true,
      });
    } catch {
      // Always show success — don't reveal if email exists
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>✉</Text>
        </View>
        <Text style={styles.heading}>Check Your Email</Text>
        <Text style={styles.subheading}>
          If an account exists for {email}, you'll receive a password reset link shortly. Check your spam folder if you don't see it.
        </Text>
        <Text style={styles.note}>
          Note: Email delivery requires domain setup to be completed. If you don't receive anything, call us at 614-453-1200.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Reset Password</Text>
      <Text style={styles.subheading}>
        Enter your email and we'll send you a link to reset your password.
      </Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitBtnText}>Send Reset Link</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Back to Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 24, paddingBottom: 100 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#dbeafe", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 16 },
  icon: { fontSize: 28 },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 8, textAlign: "center" },
  subheading: { fontSize: 14, color: "#6b7280", marginBottom: 16, textAlign: "center", lineHeight: 20 },
  note: { fontSize: 12, color: "#9ca3af", textAlign: "center", lineHeight: 18, marginBottom: 24, fontStyle: "italic" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  inputLabel: { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15, color: "#111827" },
  submitBtn: { backgroundColor: NAVY, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  btn: { backgroundColor: "#fff", borderRadius: 14, paddingVertical: 16, alignItems: "center", borderWidth: 1.5, borderColor: "#e5e7eb" },
  btnText: { color: NAVY, fontWeight: "700", fontSize: 16 },
  linkText: { color: "#9ca3af", fontSize: 14, textAlign: "center", textDecorationLine: "underline" },
});
