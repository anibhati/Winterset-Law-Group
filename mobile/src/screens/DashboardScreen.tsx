import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{user?.name ?? "there"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.cardRow}>
          <View style={styles.card}><Text style={styles.cardTitle}>Payment Plans</Text><Text style={styles.cardSub}>View your plan</Text></View>
          <View style={styles.card}><Text style={styles.cardTitle}>Messages</Text><Text style={styles.cardSub}>View inbox</Text></View>
        </View>
        <View style={styles.cardRow}>
          <View style={styles.card}><Text style={styles.cardTitle}>Disputes</Text><Text style={styles.cardSub}>File or view</Text></View>
          <View style={styles.card}><Text style={styles.cardTitle}>Account</Text><Text style={styles.cardSub}>Your profile</Text></View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  greeting: { fontSize: 16, color: "#6b7280" },
  name: { fontSize: 28, fontWeight: "700", color: "#10283B", marginTop: 2 },
  email: { fontSize: 14, color: "#9ca3af", marginTop: 4, marginBottom: 32 },
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#10283B", marginBottom: 4 },
  cardSub: { fontSize: 13, color: "#9ca3af" },
  logout: { marginTop: 32, backgroundColor: "#10283B", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
