import React, { createContext, useContext, useEffect, useState } from "react";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredToken().then(token => {
      if (!token) setLoading(false);
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiFetch<LoginResponse>("/api/mobile/login", {
      method: "POST", body: { email, password }, skipAuth: true,
    });
    await setStoredToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await clearStoredToken();
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
