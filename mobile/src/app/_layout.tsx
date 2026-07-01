import React from "react";
import { Tabs } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Svg, { Path, Circle, Line, Rect, Polyline } from "react-native-svg";

const NAVY = "#10283B";

function HomeIcon({ active }: { active: boolean }) {
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? NAVY : "#9ca3af"} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round"><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><Polyline points="9 22 9 12 15 12 15 22" /></Svg>;
}
function PayIcon({ active }: { active: boolean }) {
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? NAVY : "#9ca3af"} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round"><Rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><Line x1="1" y1="10" x2="23" y2="10" /></Svg>;
}
function DisputeIcon({ active }: { active: boolean }) {
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? NAVY : "#9ca3af"} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round"><Circle cx="12" cy="12" r="10" /><Line x1="12" y1="8" x2="12" y2="12" /><Line x1="12" y1="16" x2="12.01" y2="16" /></Svg>;
}
function AccountIcon({ active }: { active: boolean }) {
  return <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? NAVY : "#9ca3af"} strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round"><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><Circle cx="12" cy="7" r="4" /></Svg>;
}

function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={NAVY} size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: NAVY },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700", fontSize: 16 },
        headerTitle: "WLG Client Portal",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          height: 84,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarActiveTintColor: NAVY,
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 2 },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ tabBarLabel: "Home", tabBarIcon: ({ focused }) => <HomeIcon active={focused} /> }} />
      <Tabs.Screen name="payment" options={{ tabBarLabel: "Pay", tabBarIcon: ({ focused }) => <PayIcon active={focused} /> }} />
      <Tabs.Screen name="dispute" options={{ tabBarLabel: "Dispute", tabBarIcon: ({ focused }) => <DisputeIcon active={focused} /> }} />
      <Tabs.Screen name="account" options={{ tabBarLabel: "Account", tabBarIcon: ({ focused }) => <AccountIcon active={focused} /> }} />
      <Tabs.Screen name="index" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="login" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" },
});
