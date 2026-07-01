import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { apiFetch, setStoredToken, clearStoredToken, getStoredToken } from "../api/client";

interface User { id: string; name: string; email: string; role: string; }
interface LoginResponse { token: string; user: User; }
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Stores user object alongside token so name/email survive app restarts
const USER_KEY = "wlg_user";
import * as SecureStore from "expo-secure-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    restoreSession();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "login";
    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/dashboard");
    }
  }, [user, loading, segments]);

  async function restoreSession() {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync("wlg_auth_token"),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      if (token && userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch {
      // Ignore restore errors — treat as logged out
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await apiFetch<LoginResponse>("/api/mobile/login", {
      method: "POST", body: { email, password }, skipAuth: true,
    });
    await Promise.all([
      setStoredToken(res.token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user)),
    ]);
    setUser(res.user);
  }

  async function logout() {
    await Promise.all([
      clearStoredToken(),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
