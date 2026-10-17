"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/auth");
    }
  }

  return (
    <button
      className="cursor-pointer border border-white/15 px-3 py-2 text-left text-xs text-white/70 transition-colors hover:border-[#f6cb57] hover:text-[#f6cb57] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-8 lg:border-0 lg:px-0 lg:py-0"
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? "Logging out..." : "Log out"}
    </button>
  );
}
