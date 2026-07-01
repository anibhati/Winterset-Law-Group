import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useAuth } from "../context/AuthContext";
export default function AccountScreen() {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.c}>
        <View style={styles.card}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={logout}>
          <Text style={styles.btnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  c: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  name: { fontSize: 20, fontWeight: "700", color: "#10283B" },
  email: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  btn: { backgroundColor: "#10283B", borderRadius: 12, padding: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
