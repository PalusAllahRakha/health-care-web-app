"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AppShell enableSessionTimeout={false}>{children}</AppShell>
    </AuthGuard>
  );
}
