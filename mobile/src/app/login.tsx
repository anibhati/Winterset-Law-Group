import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  StyleSheet, SafeAreaView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

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
      // Navigation handled automatically by AuthContext
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.container}>
          <Text style={styles.title}>Winterset Law Group</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              value={email} onChangeText={setEmail}
              autoCapitalize="none" keyboardType="email-address"
              autoComplete="email" placeholder="you@example.com"
              placeholderTextColor="#9ca3af" style={styles.input}
            />
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              value={password} onChangeText={setPassword}
              secureTextEntry autoComplete="password"
              placeholder="••••••••" placeholderTextColor="#9ca3af"
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSubmit} disabled={submitting} style={styles.button}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#10283B" },
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "rgba(255,255,255,0.6)", marginBottom: 32, fontSize: 15 },
  inputCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 },
  inputLabel: { color: "#6b7280", fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { fontSize: 16, color: "#111827" },
  error: { color: "#f87171", fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: "#B1784D", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
