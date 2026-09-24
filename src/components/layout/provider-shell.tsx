"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ProviderApprovalLock } from "@/components/provider/provider-approval-lock";
import {
  findProvider,
  resolveStatus,
  subscribeProviderApprovals,
  type ProviderRecord,
} from "@/lib/auth/provider-approvals";
import { useAuth } from "@/providers/auth-provider";

function ProviderWorkspace({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [record, setRecord] = useState<ProviderRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setRecord(user ? findProvider(user.email) ?? null : null);
    sync();
    setReady(true);
    return subscribeProviderApprovals(sync);
  }, [user]);

  if (!ready) return null;

  if (record && resolveStatus(record) !== "approved") {
    return <ProviderApprovalLock record={record} onSignOut={logout} />;
  }

  return <AppShell enableSessionTimeout={false} notificationCount={4}>{children}</AppShell>;
}

export function ProviderShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["provider"]}>
      <ProviderWorkspace>{children}</ProviderWorkspace>
    </AuthGuard>
  );
}
