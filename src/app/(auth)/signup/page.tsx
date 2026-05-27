"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FIRM } from "@/lib/constants";

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const password = watch("password");

  async function onSubmit(data: SignupForm) {
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone.replace(/\D/g, ""),
        password: data.password,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Registration failed. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card shadow-lg text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Account Created</h2>
          <p className="text-gray-600 text-sm">Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="card shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-navy-900">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Securely access your {FIRM.shortName} debt account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                className="input-field"
                placeholder="Jane Smith"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email <span className="text-red-500">*</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Mobile Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                className="input-field"
                placeholder="(614) 555-0100"
                {...register("phone", {
                  required: "Phone is required for two-factor authentication",
                  pattern: { value: /^\+?1?\d{10}$/, message: "Enter a valid 10-digit phone" },
                })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              <p className="text-gray-400 text-xs mt-1">Required for two-factor authentication.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="input-field"
                placeholder="Min. 12 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 12, message: "At least 12 characters" },
                  validate: {
                    upper: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
                    lower: (v) => /[a-z]/.test(v) || "Must include a lowercase letter",
                    number: (v) => /[0-9]/.test(v) || "Must include a number",
                    special: (v) => /[^A-Za-z0-9]/.test(v) || "Must include a special character",
                  },
                })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="input-field"
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="termsAccepted"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
              {...register("termsAccepted", { required: "You must accept the Terms & Conditions" })}
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/legal/terms" target="_blank" className="text-gold-600 hover:underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" target="_blank" className="text-gold-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        🔒 Two-factor authentication required after account creation
      </p>
    </div>
  );
}
