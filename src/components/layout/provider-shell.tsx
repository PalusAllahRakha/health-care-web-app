"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export function ProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["provider"]}>
      <AppShell enableSessionTimeout={false}>{children}</AppShell>
    </AuthGuard>
  );
}
