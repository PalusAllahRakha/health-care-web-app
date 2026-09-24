"use client";

import Link from "next/link";
import { use } from "react";
import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointment, formatAppointmentDate } from "@/lib/api/queries";
import { formatTime } from "@/lib/utils";

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: appointment, isLoading, isError } = useAppointment(id);

  if (isLoading) {
    return (
      <PageLayout>
        <SectionLoader label="Loading appointment" sublabel="Fetching visit details" />
      </PageLayout>
    );
  }

  if (isError || !appointment) {
    return (
      <PageLayout>
        <ErrorState
          title="Appointment not found"
          description="This appointment may have been cancelled or the link is incorrect."
          backLabel="Back to appointments"
          backHref="/appointments"
        />
      </PageLayout>
    );
  }

  const details = [
    { icon: Stethoscope, label: "Provider", value: appointment.doctorName, sub: appointment.specialty },
    { icon: Calendar, label: "Date", value: formatAppointmentDate(appointment) },
    { icon: Clock, label: "Time", value: formatTime(appointment.time) },
    { icon: MapPin, label: "Location", value: appointment.location },
  ];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Visit details"
        title={appointment.specialty}
        description={`Appointment with ${appointment.doctorName}`}
        breadcrumbs={[
          { label: "Appointments", href: "/appointments" },
          { label: "Details" },
        ]}
      >
        <Button asChild variant="outline">
          <Link href="/appointments">Back</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-hover overflow-hidden lg:col-span-2">
          <div className="h-1 bg-[var(--color-brand-primary)]" aria-hidden />
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
            <CardTitle className="text-base">Appointment information</CardTitle>
            <Badge variant={appointment.status === "upcoming" ? "success" : appointment.status === "cancelled" ? "destructive" : "secondary"} className="capitalize">
              {appointment.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-disabled)]">{label}</p>
                  <p className="mt-0.5 font-semibold text-[var(--color-text-primary)]">{value}</p>
                  {sub && <p className="text-sm text-[var(--color-text-secondary)]">{sub}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Before your visit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <p>· Arrive 15 minutes early for check-in</p>
              <p>· Bring your insurance card and photo ID</p>
              <p>· List any new symptoms or medications</p>
            </CardContent>
          </Card>

          {appointment.status === "upcoming" && (
            <Card>
              <CardContent className="flex flex-col gap-2 p-4">
                <Button variant="outline" className="w-full">Reschedule</Button>
                <Button variant="destructive" className="w-full">Cancel appointment</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
