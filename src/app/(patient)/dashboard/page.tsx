"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, FlaskConical, MessageSquare, Pill, Plus, Stethoscope } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UpcomingAppointmentCard } from "@/components/dashboard/upcoming-appointment-card";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useDashboardStats, useUpcomingAppointments } from "@/lib/api/queries";
import { notifications } from "@/lib/mock-data";

const quickActions = [
  { label: "Book an appointment", description: "Find a time for your next visit", href: "/appointments", icon: CalendarDays },
  { label: "View lab results", description: "Your reports, all in one place", href: "/lab-results", icon: FlaskConical },
  { label: "Message your care team", description: "Keep the conversation going", href: "/messages", icon: MessageSquare },
  { label: "Manage prescriptions", description: "Review medications and refills", href: "/prescriptions", icon: Pill },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const { data: stats, isPending: statsLoading } = useDashboardStats();
  const { data: upcoming, isPending: upcomingLoading } = useUpcomingAppointments();
  const nextAppointment = upcoming?.[0];
  const careTeam = upcoming?.filter((appointment, index, all) => all.findIndex((item) => item.doctorId === appointment.doctorId) === index).slice(0, 3) ?? [];
  const criticalAlert = notifications.find((n) => n.type === "result" && !n.read && n.title.includes("Critical"));

  return (
    <PageLayout>
      <div className="flex flex-col gap-5 pt-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Your health, at a glance</p>
          <h1 className="mt-2.5 text-[1.75rem] font-semibold leading-tight tracking-[-0.035em] text-[var(--color-text-primary)] sm:text-[2.125rem]">Welcome back, {firstName}.</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">A little clarity for your day. Your care starts here.</p>
        </div>
        <Button asChild className="w-fit shrink-0">
          <Link href="/appointments"><Plus className="h-4 w-4" />Book appointment</Link>
        </Button>
      </div>

      {criticalAlert && <AlertBanner variant="critical" title={criticalAlert.title} message={criticalAlert.body} href={criticalAlert.href} />}

      {statsLoading ? (
        <SectionLoader label="Loading your overview" sublabel="Gathering visits, results, and messages" minHeight="min-h-[150px]" />
      ) : stats ? <StatCards {...stats} /> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {upcomingLoading ? (
          <SectionLoader label="Loading appointments" sublabel="Checking your schedule" minHeight="min-h-[320px]" />
        ) : <UpcomingAppointmentCard appointment={nextAppointment} />}

        <Card>
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <h2 className="text-base font-semibold tracking-tight">How can we help?</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">The things you need, a little closer.</p>
          </CardHeader>
          <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
            <ul className="divide-y divide-[var(--color-border-subtle)]">
              {quickActions.map(({ label, description, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[var(--color-surface-muted)]/60">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-brand-primary)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium group-hover:text-[var(--color-brand-primary)]">{label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">{description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--color-text-disabled)]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ActivityFeed />
        <Card className="flex flex-col">
          <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-3">
            <h2 className="text-base font-semibold tracking-tight">Your care team</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">Providers for your upcoming visits</p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
            {upcomingLoading ? (
              <p role="status" className="py-5 text-sm text-[var(--color-text-secondary)]">Loading your care team…</p>
            ) : careTeam.length > 0 ? (
              <ul className="divide-y divide-[var(--color-border-subtle)]">
                {careTeam.map((appointment) => (
                  <li key={appointment.doctorId} className="flex items-center gap-3 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-xs font-semibold text-[var(--color-brand-primary)]" aria-hidden>
                      {appointment.doctorName.replace(/^Dr\.\s*/, "").split(" ").map((name) => name[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{appointment.doctorName}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{appointment.specialty}</p>
                    </div>
                    <Link href={`/appointments/${appointment.id}`} aria-label={`View your appointment with ${appointment.doctorName}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-brand-primary)]">
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="py-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">Find a provider and schedule a visit to start building your care team.</p>}
            <div className="mt-auto border-t border-[var(--color-border-subtle)] pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/doctors"><Stethoscope className="h-4 w-4" />Find a doctor<ArrowRight className="ml-auto h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
