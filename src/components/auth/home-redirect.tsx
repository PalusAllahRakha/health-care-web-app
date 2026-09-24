"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { getRoleHomePath } from "@/lib/auth/roles";

export function HomeRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, mfaVerified, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (user && !mfaVerified) {
      router.replace("/mfa");
      return;
    }
    if (isAuthenticated && user) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [user, isAuthenticated, mfaVerified, isLoading, router]);

  return null;
}
