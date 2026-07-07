import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  StyleSheet, SafeAreaView, ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Image
              source={require("../../assets/images/wlg-logo-white.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email} onChangeText={setEmail}
                autoCapitalize="none" keyboardType="email-address"
                autoComplete="email" placeholder="you@example.com"
                placeholderTextColor="#9ca3af" style={styles.input}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={password} onChangeText={setPassword}
                secureTextEntry autoComplete="password"
                placeholder="••••••••" placeholderTextColor="#9ca3af"
                style={styles.input}
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.button}>
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>

          <Text style={styles.security}>🔒 Secured with 256-bit TLS encryption</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: NAVY },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 28, paddingVertical: 40 },
  logoWrap: { alignItems: "center", marginBottom: 12 },
  logo: { width: 220, height: 90 },
  subtitle: { color: "rgba(255,255,255,0.55)", textAlign: "center", marginBottom: 36, fontSize: 15 },
  formCard: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", overflow: "hidden", marginBottom: 20 },
  inputGroup: { paddingHorizontal: 18, paddingVertical: 14 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginHorizontal: 18 },
  inputLabel: { color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 },
  input: { fontSize: 16, color: "#fff" },
  error: { color: "#fca5a5", fontSize: 13, marginBottom: 12, textAlign: "center" },
  button: { backgroundColor: BRONZE, borderRadius: 14, paddingVertical: 17, alignItems: "center", marginBottom: 24 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  security: { color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center" },
});
