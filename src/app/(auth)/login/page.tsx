"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FIRM } from "@/lib/constants";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  async function onSubmit({ email, password }: LoginForm) {
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // If 2FA is enabled, middleware will redirect to /verify-2fa
    // Otherwise, go to dashboard
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="card shadow-lg">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">⚖️</div>
          <h1 className="text-2xl font-serif font-bold text-navy-900">Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Access your {FIRM.shortName} account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input-field"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-gold-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="input-field"
              placeholder="••••••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold-600 font-medium hover:underline">
            Create one
          </Link>
        </div>
      </div>

      {/* Security notice */}
      <p className="text-center text-xs text-gray-400 mt-4">
        🔒 Secured with 256-bit TLS encryption and two-factor authentication
      </p>
    </div>
  );
}
