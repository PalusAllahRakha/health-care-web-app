"use client";

import { useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import { CalendarView } from "@/components/appointments/calendar-view";
import { DoctorAvailabilitySlot } from "@/components/appointments/doctor-availability-slot";
import { getAvailableSlots, groupSlotsByPeriod, isWeekendDate } from "@/lib/booking-availability";
import { formatDate, formatTime } from "@/lib/utils";
import type { Doctor } from "@/types";

interface BookingDatetimeStepProps {
  doctor?: Doctor;
  date: string;
  time: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

function SlotGroup({
  label,
  slots,
  selectedTime,
  onSelect,
}: {
  label: string;
  slots: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
}) {
  if (slots.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <DoctorAvailabilitySlot
            key={slot}
            time={slot}
            selected={selectedTime === slot}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function BookingDatetimeStep({
  doctor,
  date,
  time,
  onDateSelect,
  onTimeSelect,
}: BookingDatetimeStepProps) {
  const availableSlots = useMemo(
    () => (doctor ? getAvailableSlots(doctor.id, date) : []),
    [doctor, date]
  );
  const { morning, afternoon } = useMemo(
    () => groupSlotsByPeriod(availableSlots),
    [availableSlots]
  );

  return (
    <div className="space-y-5">
      {doctor && (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-xs font-bold text-white">
            {doctor.name.replace(/^Dr\.\s*/, "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{doctor.name}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{doctor.specialty}</p>
          </div>
        </div>
      )}

      <CalendarView
        selectedDate={date}
        onDateSelect={onDateSelect}
        disableWeekends
        className="border-0 bg-[var(--color-surface-muted)]/50 p-3"
      />

      {date && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Calendar className="h-4 w-4 text-[var(--color-brand-primary)]" />
            <span>{formatDate(date)}</span>
            {time && (
              <>
                <span className="text-[var(--color-text-disabled)]">·</span>
                <Clock className="h-4 w-4 text-[var(--color-brand-primary)]" />
                <span>{formatTime(time)}</span>
              </>
            )}
          </div>

          {isWeekendDate(date) ? (
            <p className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-text-secondary)]">
              No appointments on weekends. Please choose a weekday.
            </p>
          ) : availableSlots.length === 0 ? (
            <p className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3 text-sm text-[var(--color-text-secondary)]">
              No open slots on this date. Try another day.
            </p>
          ) : (
            <>
              <SlotGroup label="Morning" slots={morning} selectedTime={time} onSelect={onTimeSelect} />
              <SlotGroup label="Afternoon" slots={afternoon} selectedTime={time} onSelect={onTimeSelect} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
