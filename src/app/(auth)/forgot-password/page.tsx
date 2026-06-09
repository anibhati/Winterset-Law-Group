"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import BackButton from '@/components/ui/BackButton';
// ...
<div className="mb-6">
  <BackButton href="/dashboard" label="Back to dashboard" />
</div>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();

  async function onSubmit({ email }: { email: string }) {
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card shadow-lg">
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">Check Your Inbox</h2>
            <p className="text-gray-600 text-sm">
              If that email is registered, you&apos;ll receive a password reset link shortly.
            </p>
            <Link href="/login" className="btn-primary mt-6 inline-flex">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-serif font-bold text-navy-900">Reset Password</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your email and we&apos;ll send a reset link</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email Address</label>
                <input id="email" type="email" className="input-field" placeholder="you@example.com"
                  {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <Link href="/login" className="block text-center text-sm text-gold-600 mt-4 hover:underline">Back to Sign In</Link>
          </>
        )}
      </div>
    </div>
  );
}
