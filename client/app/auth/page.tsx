"use client";

import { ChangeEvent, SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";
const emptyForm = {
  username: "",
  phone: "",
  email: "",
  password: "",
};

export default function AuthPage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard");
    }
  }, [isLoading, router, user]);

  if (isLoading || user) return null;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const payload =
      mode === "signup"
        ? formData
        : { email: formData.email, password: formData.password };
    const endpoint = mode === "signup" ? "/auth/register" : "/auth/login";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Something went wrong.");
      }

      if (mode === "login") {
        const loggedInUser = await refreshUser();
        router.replace(
          loggedInUser?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard",
        );
        return;
      }
      setMessage(result.message);
      setFormData(emptyForm);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#ef694d] text-[#18211f]">
      <main className="mx-auto grid min-h-screen max-w-[1120px] items-center gap-10 px-5 py-10 sm:grid-cols-2 sm:gap-16 sm:px-8 sm:py-16">
        <section className="py-5 text-white sm:pb-16">
          <p className="mb-6 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[1.5px]">
            <span className="h-2 w-2 rounded-full bg-[#f6cb57]" /> A little
            closer
          </p>
          <h1 className="font-serif text-[56px] font-normal leading-[.93] tracking-[-3px] sm:text-[clamp(56px,6vw,78px)]">
            Let&apos;s get
            <br />
            <em className="text-[#f6cb57]">you inside.</em>
          </h1>
          <p className="mt-7 max-w-[330px] text-[15px] leading-[1.6]">
            Create an account to save events, follow organisers, and keep every
            plan within reach.
          </p>
        </section>
        <section className="border border-[#d5d5cb] bg-[#f7f5ef] px-5.5 py-7 shadow-[12px_12px_0_#18211f] sm:px-10 sm:pb-8 sm:pt-9">
          <div
            className="mb-7 flex gap-7 border-b border-[#d5d5cb]"
            role="tablist"
            aria-label="Account access"
          >
            {(["login", "signup"] as const).map((tab) => (
              <button
                className={`relative cursor-pointer border-0 bg-transparent pb-3.5 text-sm ${mode === tab ? "font-bold after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:bg-[#ef694d]" : "text-[#87908b]"}`}
                key={tab}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                onClick={() => setMode(tab)}
              >
                {tab === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <label className="grid gap-1.5 text-[11px] font-bold text-[#53605c]">
                  Username
                  <input
                    className="w-full border-0 border-b border-[#d5d5cb] bg-transparent px-0 py-2 outline-none transition-colors focus:border-[#ef694d]"
                    type="text"
                    name="username"
                    placeholder="alexmorgan"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-[11px] font-bold text-[#53605c]">
                  Phone number
                  <input
                    className="w-full border-0 border-b border-[#d5d5cb] bg-transparent px-0 py-2 outline-none transition-colors focus:border-[#ef694d]"
                    type="tel"
                    name="phone"
                    placeholder="+1 555 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </>
            )}
            <label className="grid gap-1.5 text-[11px] font-bold text-[#53605c]">
              Email address
              <input
                className="w-full border-0 border-b border-[#d5d5cb] bg-transparent px-0 py-2 outline-none transition-colors focus:border-[#ef694d]"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="grid gap-1.5 text-[11px] font-bold text-[#53605c]">
              Password
              <input
                className="w-full border-0 border-b border-[#d5d5cb] bg-transparent px-0 py-2 outline-none transition-colors focus:border-[#ef694d]"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className="mt-2 inline-flex w-full cursor-pointer justify-center gap-4 rounded-[2px] border-0 bg-[#18211f] px-4.5 py-3.5 text-white transition hover:-translate-y-0.5 hover:bg-[#ef694d] disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Welcome back"
                  : "Create my account"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
          {message && (
            <p
              className="mt-4 text-center text-xs text-[#53605c]"
              role="status"
            >
              {message}
            </p>
          )}
          <p className="mt-6 text-center text-[11px] text-[#69736e]">
            {mode === "login" ? "New to gather?" : "Already have an account?"}{" "}
            <button
              className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[#ef694d]"
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
