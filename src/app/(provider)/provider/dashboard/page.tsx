"use client";

import Link from "next/link";
import { Calendar, ChevronRight, FlaskConical, MessageSquare, Pill, Users } from "lucide-react";
import { MotionGrid } from "@/components/motion/motion-grid";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerLabs, providerRefills, providerThreads, providerVisits } from "@/lib/provider-work";
import { useAuth } from "@/providers/auth-provider";

const links = [
  { label: "Open today's schedule", description: "Check in patients and start visits", href: "/provider/schedule", icon: Calendar },
  { label: "Review the patient queue", description: "Conditions, visits, and chart notes", href: "/provider/patients", icon: Users },
  { label: "Sign off on labs", description: "Release or hold results for patients", href: "/provider/labs", icon: FlaskConical },
  { label: "Answer refill requests", description: "Approve or deny medication refills", href: "/provider/prescriptions", icon: Pill },
  { label: "Reply to patients", description: "Secure messages waiting in the inbox", href: "/provider/messages", icon: MessageSquare },
];

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "Doctor";
  const waiting = providerVisits.filter((visit) => visit.status === "scheduled" || visit.status === "checked-in").length;
  const labs = providerLabs.filter((lab) => lab.status === "needs-review").length;
  const refills = providerRefills.filter((refill) => refill.decision === "pending").length;
  const unread = providerThreads.reduce((sum, thread) => sum + thread.unread, 0);
  const stats = [
    { label: "Visits left today", value: waiting },
    { label: "Labs to review", value: labs },
    { label: "Refills pending", value: refills },
    { label: "Unread messages", value: unread },
  ];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Provider"
        title={`Good day, ${firstName}.`}
        description="Today's clinic: visits to see, results to release, and refills waiting on you."
      />

      <MotionGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card p-5">
            <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
          </div>
        ))}
      </MotionGrid>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {providerVisits.slice(0, 4).map((visit) => (
              <div key={visit.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{visit.time} · {visit.patientName}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{visit.reason}</p>
                </div>
                <Badge variant="secondary" className="capitalize">{visit.status.replace("-", " ")}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">What needs you</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <ul className="divide-y divide-[var(--color-border-subtle)]">
              {links.map(({ label, description, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-[var(--color-surface-muted)]/60">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-brand-primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium group-hover:text-[var(--color-brand-primary)]">{label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-disabled)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
