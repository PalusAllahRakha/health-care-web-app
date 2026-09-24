"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isWeekend, nextMonday } from "date-fns";
import { Calendar, ChevronRight, Clock3, Plus } from "lucide-react";
import { BookingModal } from "@/components/appointments/booking-modal";
import { CalendarView } from "@/components/appointments/calendar-view";
import { DoctorAvailabilitySlot } from "@/components/appointments/doctor-availability-slot";
import { SpecialtyFilter } from "@/components/appointments/specialty-filter";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { TIME_SLOTS, useAppointments, useDoctors, formatAppointmentDate } from "@/lib/api/queries";
import { getAvailableSlots } from "@/lib/booking-availability";
import { useBookingStore } from "@/stores/booking-store";
import { getDoctorById } from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/utils";
import type { BookingInput } from "@/lib/validators/booking";

export default function AppointmentsPage() {
  const [specialty, setSpecialty] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return format(isWeekend(today) ? nextMonday(today) : today, "yyyy-MM-dd");
  });
  const [selectedTime, setSelectedTime] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: appointments, isLoading: appointmentsLoading } = useAppointments();
  const { data: filteredDoctors, isLoading: doctorsLoading } = useDoctors(specialty === "all" ? undefined : specialty);
  const { setDoctorId, setDate, setTime, setSpecialty: setBookingSpecialty, setStep, reset } = useBookingStore();

  const markedDates = useMemo(
    () => appointments?.filter((appointment) => appointment.status === "upcoming").map((appointment) => appointment.date) ?? [],
    [appointments]
  );
  const availableTimes = useMemo(() => {
    const slots = new Set(filteredDoctors?.flatMap((doctor) => getAvailableSlots(doctor.id, selectedDate)) ?? []);
    return TIME_SLOTS.filter((slot) => slots.has(slot));
  }, [filteredDoctors, selectedDate]);
  const availableDoctors = useMemo(
    () => filteredDoctors?.filter((doctor) => {
      const slots = getAvailableSlots(doctor.id, selectedDate);
      return selectedTime ? slots.includes(selectedTime) : slots.length > 0;
    }) ?? [],
    [filteredDoctors, selectedDate, selectedTime]
  );
  const upcoming = appointments?.filter((appointment) => appointment.status === "upcoming") ?? [];

  function openBooking(doctorId?: string) {
    reset();
    const doctor = doctorId ? getDoctorById(doctorId) : undefined;
    if (doctor) {
      setBookingSpecialty(doctor.specialty);
      setDoctorId(doctor.id);
      setDate(selectedDate);
      if (selectedTime && getAvailableSlots(doctor.id, selectedDate).includes(selectedTime)) setTime(selectedTime);
      setStep("datetime");
    } else {
      if (specialty !== "all") setBookingSpecialty(specialty);
      setStep(specialty === "all" ? "specialty" : "doctor");
    }
    setModalOpen(true);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    setSelectedTime("");
  }

  function handleSpecialtyChange(value: string) {
    setSpecialty(value);
    setSelectedTime("");
  }

  function handleBookingComplete(data: BookingInput) {
    const doctor = getDoctorById(data.doctorId);
    toast.success("Appointment booked", {
      description: `Scheduled with ${doctor?.name ?? "your doctor"} on ${formatDate(data.date)} at ${formatTime(data.time)}.`,
    });
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Your care, on your calendar"
        title="Appointments"
        description="Find a time that works for you and stay on top of your visits."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Appointments" }]}
      >
        <Button onClick={() => openBooking()}><Plus className="size-4" aria-hidden /> Book appointment</Button>
      </PageHeader>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Find your next visit</h2>
        <SpecialtyFilter value={specialty} onChange={handleSpecialtyChange} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-4">
          <CalendarView selectedDate={selectedDate} onDateSelect={handleDateSelect} markedDates={markedDates} disableWeekends />
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm"><Clock3 className="size-4 text-[var(--color-brand-primary)]" aria-hidden /> Available times</CardTitle>
              <CardDescription className="text-xs">{formatDate(selectedDate)} · Select a time to filter providers</CardDescription>
            </CardHeader>
            <CardContent>
              {doctorsLoading ? <p className="py-3 text-sm text-[var(--color-text-secondary)]" role="status">Checking available times…</p> : availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                  {availableTimes.map((slot) => <DoctorAvailabilitySlot key={slot} time={slot} selected={selectedTime === slot} onSelect={(time) => setSelectedTime(time === selectedTime ? "" : time)} className="px-1 text-xs" />)}
                </div>
              ) : <p className="py-3 text-sm text-[var(--color-text-secondary)]">No times available. Try another date or specialty.</p>}
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="border-b border-[var(--color-border-subtle)]">
            <div className="flex flex-wrap items-center justify-between gap-2"><CardTitle className="text-base">Available providers</CardTitle><Badge variant="secondary">{availableDoctors.length} available</Badge></div>
            <CardDescription className="text-xs">{selectedTime ? `${formatDate(selectedDate)} at ${formatTime(selectedTime)}` : "Choose a provider to review and book your visit."}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {doctorsLoading ? <p className="px-6 py-10 text-center text-sm text-[var(--color-text-secondary)]" role="status">Finding your care team…</p> : availableDoctors.length > 0 ? (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {availableDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex flex-wrap items-center gap-3 px-5 py-5 sm:flex-nowrap sm:px-6">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/8 text-sm font-medium text-[var(--color-brand-primary)]" aria-hidden>{doctor.name.replace(/^Dr\.\s*/, "").split(" ").map((name) => name[0]).join("").slice(0, 2)}</div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[var(--color-text-primary)]">{doctor.name}</p><p className="mt-1 text-xs text-[var(--color-text-secondary)]">{doctor.specialty}</p></div>
                    <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={() => openBooking(doctor.id)} aria-label={`Select ${doctor.name}`}>Select <ChevronRight className="size-3.5" aria-hidden /></Button>
                  </div>
                ))}
              </div>
            ) : <div className="px-6 py-10 text-center"><p className="text-sm font-medium">No providers for this selection</p><p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">Try a different time, date, or specialty.</p>{selectedTime && <Button variant="link" className="mt-2 text-xs" onClick={() => setSelectedTime("")}>Show all times</Button>}</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-[var(--color-border-subtle)]">
          <div className="flex flex-wrap items-center justify-between gap-3"><CardTitle className="text-base">Your appointments</CardTitle><Badge variant="secondary">{upcoming.length} upcoming</Badge></div>
          <CardDescription className="text-xs">Your upcoming visits and appointment history.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {appointmentsLoading ? <p className="px-6 py-10 text-center text-sm text-[var(--color-text-secondary)]" role="status">Loading your appointments…</p> : appointments && appointments.length > 0 ? (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {appointments.map((appointment) => (
                <Link key={appointment.id} href={`/appointments/${appointment.id}`} className="group flex flex-wrap items-center gap-4 px-5 py-5 transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-brand-primary)] sm:px-6">
                  <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] sm:flex"><Calendar className="size-4" aria-hidden /></div>
                  <div className="min-w-0 flex-1 basis-48"><p className="text-sm font-semibold text-[var(--color-text-primary)]">{appointment.doctorName}</p><p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">{formatAppointmentDate(appointment)} · {appointment.location}</p></div>
                  <Badge variant={appointment.status === "upcoming" ? "default" : appointment.status === "cancelled" ? "destructive" : "secondary"}>{appointment.status}</Badge>
                  <ChevronRight className="size-4 shrink-0 text-[var(--color-text-disabled)] transition-colors group-hover:text-[var(--color-brand-primary)]" aria-hidden />
                </Link>
              ))}
            </div>
          ) : <EmptyState icon={Calendar} title="No appointments yet" description="Book your next visit with a provider in just a few steps." actionLabel="Book appointment" onAction={() => openBooking()} />}
        </CardContent>
      </Card>
      <BookingModal open={modalOpen} onOpenChange={setModalOpen} onComplete={handleBookingComplete} />
    </PageLayout>
  );
}
