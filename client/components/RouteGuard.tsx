"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type RouteGuardProps = {
  children: ReactNode;
  role?: "ADMIN" | "USER";
  redirectAdminTo?: string;
};

export default function RouteGuard({
  children,
  role,
  redirectAdminTo,
}: RouteGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (redirectAdminTo && user.role === "ADMIN") {
      router.replace(redirectAdminTo);
      return;
    }

    if (role && user.role !== role) {
      router.replace("/dashboard");
    }
  }, [isLoading, redirectAdminTo, role, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#18211f]">
        <p role="status" className="text-sm text-[#53605c]">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  if (
    !user ||
    (redirectAdminTo && user.role === "ADMIN") ||
    (role && user.role !== role)
  ) {
    return null;
  }

  return children;
}
