"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Suspense } from "react";

import BackButton from '@/components/ui/BackButton';
// ...
<div className="mb-6">
  <BackButton href="/dashboard" label="Back to dashboard" />
</div>

interface ResetForm { password: string; confirmPassword: string }

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetForm>();
  const password = watch("password");

  async function onSubmit({ password }: ResetForm) {
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Reset failed. The link may have expired.");
    }
  }

  if (!token) return (
    <div className="text-center">
      <p className="text-red-600 mb-4">Invalid reset link.</p>
      <Link href="/forgot-password" className="btn-primary">Request New Link</Link>
    </div>
  );

  if (success) return (
    <div className="text-center">
      <div className="text-4xl mb-3">✅</div>
      <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">Password Updated</h2>
      <p className="text-gray-500 text-sm">Redirecting to sign in...</p>
    </div>
  );

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-navy-900">Set New Password</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" className="input-field" placeholder="Min. 12 characters"
            {...register("password", {
              required: "Required", minLength: { value: 12, message: "At least 12 characters" },
              validate: {
                upper: (v) => /[A-Z]/.test(v) || "Uppercase letter required",
                number: (v) => /[0-9]/.test(v) || "Number required",
                special: (v) => /[^A-Za-z0-9]/.test(v) || "Special character required",
              }
            })} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" className="input-field" placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Required",
              validate: (v) => v === password || "Passwords do not match",
            })} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="card shadow-lg">
        <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
