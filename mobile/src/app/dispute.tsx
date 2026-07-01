import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function DisputeScreen() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Disputes</Text>
      <Text style={styles.s}>Coming soon</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },
  t: { fontSize: 20, fontWeight: "700", color: "#10283B" },
  s: { color: "#9ca3af", marginTop: 4 },
});
