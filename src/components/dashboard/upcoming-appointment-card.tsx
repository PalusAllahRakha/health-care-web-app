"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin, Plus, Stethoscope } from "lucide-react";
import type { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatTime } from "@/lib/utils";

export interface UpcomingAppointmentCardProps {
  appointment?: Appointment;
  onReschedule?: (id: string) => void;
  className?: string;
}

export const UpcomingAppointmentCard = memo(function UpcomingAppointmentCard({
  appointment,
  onReschedule,
  className,
}: UpcomingAppointmentCardProps) {
  if (!appointment) {
    return (
      <Card className={cn("flex h-full min-h-80 items-center justify-center", className)}>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Your next visit starts here</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">You have no upcoming appointments. Find a time that works for you.</p>
          </div>
          <Button asChild>
            <Link href="/appointments"><Plus className="h-4 w-4" />Book appointment</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const date = new Date(`${appointment.date}T${appointment.time}`);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <div className="bg-[#173c38] p-5 text-white sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-white/85">Your next appointment</h2>
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-medium capitalize text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b4d7c5]" aria-hidden />
            {appointment.status}
          </span>
        </div>
        <div className="mt-7 flex items-center gap-5">
          <time dateTime={appointment.date} className="flex w-[72px] shrink-0 flex-col items-center rounded-xl border border-white/20 bg-white/[0.06] py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">{month}</span>
            <span className="mt-1 text-3xl font-semibold leading-none tabular-nums">{day}</span>
          </time>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#c4dcd3]">{appointment.specialty}</p>
            <h3 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{appointment.doctorName}</h3>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80">
              <span>{weekday}</span><span aria-hidden>·</span><span>{formatTime(appointment.time)}</span>
            </p>
          </div>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
          <div>
            <p className="text-sm font-medium">{appointment.location}</p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Appointment location</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--color-border-subtle)] pt-4 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden />{formatTime(appointment.time)}</span>
          <span className="flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" aria-hidden />{appointment.specialty}</span>
          <div className="ml-auto flex items-center gap-2">
            {onReschedule && <Button variant="ghost" size="sm" onClick={() => onReschedule(appointment.id)}>Reschedule</Button>}
            <Button asChild variant="ghost" size="sm" className="-mr-2 text-[var(--color-brand-primary)]">
              <Link href={`/appointments/${appointment.id}`}>View details<ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
