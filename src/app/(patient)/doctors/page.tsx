"use client";

import { useState } from "react";
import { Search, Stethoscope } from "lucide-react";
import { BookingModal } from "@/components/appointments/booking-modal";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionLoader } from "@/components/shared/section-loader";
import { MotionGrid } from "@/components/motion/motion-grid";
import { DoctorProfileCard } from "@/components/doctors/doctor-profile-card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useDoctors } from "@/lib/api/queries";
import { useBookingStore } from "@/stores/booking-store";
import { cn, formatDate, formatTime } from "@/lib/utils";

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useDoctors();
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [bookingOpen, setBookingOpen] = useState(false);
  const booking = useBookingStore();
  const specialties = ["All specialties", ...new Set(doctors?.map((doctor) => doctor.specialty) ?? [])];

  const filtered = doctors?.filter(
    (d) =>
      (specialty === "All specialties" || d.specialty === specialty) &&
      (d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialty.toLowerCase().includes(query.toLowerCase()))
  );

  function bookDoctor(doctorId: string) {
    const doctor = doctors?.find((item) => item.id === doctorId);
    if (!doctor) return;
    booking.reset();
    booking.setSpecialty(doctor.specialty);
    booking.setDoctorId(doctorId);
    booking.setStep("datetime");
    setBookingOpen(true);
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Care team"
        title="Find a doctor"
        description="Browse providers by specialty and book appointments online."
      />

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Search by name or specialty…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              aria-label="Search doctors"
            />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]" aria-live="polite">
            {isLoading ? "Finding your care team…" : `${filtered?.length ?? 0} providers found`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
          {specialties.map((item) => (
            <button key={item} type="button" aria-pressed={specialty === item} onClick={() => setSpecialty(item)} className={cn(
              "min-h-10 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors",
              specialty === item
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
            )}>{item}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <SectionLoader label="Loading providers" sublabel="Finding available doctors" />
      ) : filtered && filtered.length > 0 ? (
        <MotionGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <DoctorProfileCard key={doctor.id} doctor={doctor} onBook={bookDoctor} />
          ))}
        </MotionGrid>
      ) : (
        <EmptyState
          icon={Stethoscope}
          title="No doctors found"
          description={query ? "Try a different search term or clear the filter." : "No providers are available right now."}
          actionLabel={query || specialty !== "All specialties" ? "Clear filters" : undefined}
          onAction={() => { setQuery(""); setSpecialty("All specialties"); }}
        />
      )}
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} onComplete={(data) => {
        const doctor = doctors?.find((item) => item.id === data.doctorId);
        toast.success("Appointment booked", {
          description: `Visit with ${doctor?.name ?? "your doctor"} on ${formatDate(data.date)} at ${formatTime(data.time)}.`,
        });
      }} />
    </PageLayout>
  );
}
