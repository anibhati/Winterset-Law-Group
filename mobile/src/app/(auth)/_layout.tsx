import { Stack } from "expo-router";

const NAVY = "#10283B";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: NAVY },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: true, headerTitle: "Create Account" }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: true, headerTitle: "Reset Password" }} />
    </Stack>
  );
}
