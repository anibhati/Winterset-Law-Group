import React, { useState } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { apiFetch, ApiError } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const NAVY = "#10283B";
const BRONZE = "#B1784D";

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords don't match", "Please make sure both passwords are the same.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password too short", "Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      // Create the account
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: { name: name.trim(), email: normalizedEmail, password },
        skipAuth: true,
      });
      // Log in with the same credentials — login() handles token storage + navigation
      await login(normalizedEmail, password);
    } catch (err) {
      Alert.alert("Error", err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subheading}>Sign up to manage your debt account with Winterset Law Group.</Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor="#9ca3af"
          style={styles.input}
        />
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Email Address</Text>
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
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
        />
        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Confirm Password</Text>
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Re-enter your password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitBtnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 24, paddingBottom: 100 },
  heading: { fontSize: 22, fontWeight: "700", color: NAVY, marginBottom: 4, textAlign: "center" },
  subheading: { fontSize: 13, color: "#6b7280", marginBottom: 24, textAlign: "center", lineHeight: 18 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  inputLabel: { fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, padding: 12, fontSize: 15, color: "#111827" },
  submitBtn: { backgroundColor: NAVY, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkText: { color: "#6b7280", fontSize: 14, textAlign: "center", textDecorationLine: "underline" },
});
