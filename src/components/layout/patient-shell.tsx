"use client";

import { useNotificationStore } from "@/stores/notification-store";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export function PatientShell({ children }: { children: React.ReactNode }) {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <AuthGuard allowedRoles={["patient"]}>
      <AppShell notificationCount={unreadCount}>{children}</AppShell>
    </AuthGuard>
  );
}
