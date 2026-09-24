"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listProviders,
  PROVIDER_REVIEW_WORKING_DAYS,
  resolveStatus,
  reviewDeadline,
  reviewProvider,
  subscribeProviderApprovals,
  timeUntil,
  type ProviderApprovalStatus,
  type ProviderRecord,
} from "@/lib/auth/provider-approvals";

const statusVariant: Record<ProviderApprovalStatus, "success" | "warning" | "destructive" | "secondary"> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
  expired: "secondary",
};

function reviewLabel(record: ProviderRecord, now: Date) {
  const status = resolveStatus(record, now);
  if (status === "approved") return "Active";
  if (status === "rejected") return "Declined";
  if (status === "expired") return "Window closed";
  const remaining = timeUntil(reviewDeadline(record.submittedAt), now);
  if (remaining.days > 0) return `${remaining.days}d ${remaining.hours}h left`;
  return `${remaining.hours}h ${remaining.minutes}m left`;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const sync = () => setProviders(listProviders());
    sync();
    setReady(true);
    const unsub = subscribeProviderApprovals(sync);
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      unsub();
      window.clearInterval(clock);
    };
  }, []);

  function decide(record: ProviderRecord, decision: "approved" | "rejected") {
    reviewProvider(record.email, decision);
    toast.success(decision === "approved" ? "Provider approved" : "Provider declined", {
      description:
        decision === "approved"
          ? `${record.name} can open the provider workspace.`
          : `${record.name} stays locked out of the provider workspace.`,
    });
  }

  const pendingCount = providers.filter((provider) => resolveStatus(provider, now) === "pending").length;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Administration"
        title="Provider management"
        description={`Review every provider account. New signups stay locked until an admin approves them within ${PROVIDER_REVIEW_WORKING_DAYS} working days.`}
      />

      {!ready ? (
        <SectionLoader label="Loading providers" sublabel="Fetching provider directory" />
      ) : (
        <Card className="card-hover overflow-hidden">
          <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
            <CardTitle className="text-base">
              {providers.length} providers · {pendingCount} awaiting approval
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={[
                {
                  key: "name",
                  header: "Name",
                  cell: (provider: ProviderRecord) => (
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">{provider.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{provider.specialty}</p>
                    </div>
                  ),
                },
                {
                  key: "email",
                  header: "Email",
                  cell: (provider: ProviderRecord) => (
                    <span className="text-[var(--color-text-secondary)]">{provider.email}</span>
                  ),
                },
                {
                  key: "license",
                  header: "License",
                  cell: (provider: ProviderRecord) => (
                    <span className="font-mono text-xs text-[var(--color-text-disabled)]">{provider.licenseNumber}</span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  cell: (provider: ProviderRecord) => {
                    const status = resolveStatus(provider, now);
                    return <Badge variant={statusVariant[status]} className="capitalize">{status}</Badge>;
                  },
                },
                {
                  key: "window",
                  header: "Review window",
                  cell: (provider: ProviderRecord) => (
                    <span className="text-[var(--color-text-secondary)]">{reviewLabel(provider, now)}</span>
                  ),
                },
                {
                  key: "actions",
                  header: "Action",
                  cell: (provider: ProviderRecord) => {
                    const status = resolveStatus(provider, now);
                    if (status !== "pending") return <span className="text-[var(--color-text-disabled)]">—</span>;
                    return (
                      <div className="flex gap-2">
                        <Button size="sm" className="min-w-0" onClick={() => decide(provider, "approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="min-w-0" onClick={() => decide(provider, "rejected")}>
                          Decline
                        </Button>
                      </div>
                    );
                  },
                },
              ]}
              data={providers}
              getRowKey={(provider) => provider.id}
              emptyMessage="No providers found"
            />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
