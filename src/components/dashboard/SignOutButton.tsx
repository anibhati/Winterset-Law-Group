"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-white/60 hover:text-white text-xs transition-colors"
    >
      Sign Out
    </button>
  );
}
