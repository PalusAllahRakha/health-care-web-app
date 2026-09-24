"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingHero } from "@/components/shared/loading-hero";
import { useAuth } from "@/providers/auth-provider";
import { getRoleHomePath } from "@/lib/auth/roles";
import type { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AUTH_STATUS = [
  "Verifying credentials…",
  "Restoring your session…",
  "Loading secure workspace…",
];

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, mfaVerified, isLoading } = useAuth();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % AUTH_STATUS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!mfaVerified) {
      router.replace("/mfa");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(getRoleHomePath(user.role));
    }
  }, [user, isAuthenticated, mfaVerified, isLoading, allowedRoles, router]);

  const ready =
    !isLoading &&
    isAuthenticated &&
    !!user &&
    (!allowedRoles || allowedRoles.includes(user.role));

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-surface)] bg-[image:var(--mesh-bg)] px-4">
        <LoadingHero
          className="w-full max-w-md"
          compact
          label="Securing your session"
          sublabel="HIPAA-protected patient portal"
          status={AUTH_STATUS[statusIndex]}
        />
      </div>
    );
  }

  return <>{children}</>;
}
