"use client";

import { Activity, Calendar, FlaskConical, HardDrive, MessageSquare, Server, Users } from "lucide-react";
import { MotionGrid } from "@/components/motion/motion-grid";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSystemMetrics } from "@/lib/api/queries";

const metricConfig = [
  { key: "totalUsers" as const, label: "Total users", icon: Users, accent: "stat-accent-brand" },
  { key: "activePatients" as const, label: "Active patients", icon: Users, accent: "stat-accent-info" },
  { key: "activeProviders" as const, label: "Active providers", icon: Activity, accent: "stat-accent-brand" },
  { key: "appointmentsToday" as const, label: "Today", icon: Calendar, accent: "stat-accent-warning" },
  { key: "appointmentsThisWeek" as const, label: "This week", icon: Calendar, accent: "stat-accent-brand" },
  { key: "labResultsPending" as const, label: "Pending labs", icon: FlaskConical, accent: "stat-accent-warning" },
  { key: "messagesUnread" as const, label: "Unread messages", icon: MessageSquare, accent: "stat-accent-info" },
  { key: "avgResponseTimeMs" as const, label: "Avg response", icon: Server, accent: "stat-accent-brand" },
];

export default function AdminOverviewPage() {
  const { data: metrics, isLoading } = useSystemMetrics();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Administration"
        title="System overview"
        description="Platform health, usage metrics, and infrastructure status."
      />

      {isLoading ? (
        <SectionLoader label="Loading metrics" sublabel="Fetching system data" />
      ) : metrics ? (
        <>
          <MotionGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricConfig.map(({ key, label, icon: Icon, accent }) => (
              <div key={key} className={accent}>
                <div className="stat-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold tabular-nums">
                      {typeof metrics[key] === "number" ? metrics[key].toLocaleString() : metrics[key]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{label}</p>
                </div>
              </div>
            ))}
          </MotionGrid>

          <div className="grid gap-6 lg:grid-cols-2 mt-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-5 w-5 text-[var(--color-brand-primary)]" />
                  System uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-[var(--color-brand-primary)]">{metrics.systemUptimePercent}%</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Last 30 days availability</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <HardDrive className="h-5 w-5 text-[var(--color-brand-primary)]" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">Used</span>
                  <span className="font-semibold">{metrics.storageUsedGb} / {metrics.storageTotalGb} GB</span>
                </div>
                <Progress value={Math.round((metrics.storageUsedGb / metrics.storageTotalGb) * 100)} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </PageLayout>
  );
}
