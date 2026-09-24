"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import type { Doctor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelative } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const availabilityConfig = {
  today: { label: "Available today", variant: "success" as const },
  soon: { label: "Next few days", variant: "warning" as const },
  unavailable: { label: "Limited availability", variant: "secondary" as const },
};

export interface BookingDoctorCardProps {
  doctor: Doctor;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const BookingDoctorCard = memo(function BookingDoctorCard({
  doctor,
  selected,
  onSelect,
}: BookingDoctorCardProps) {
  const disabled = doctor.availability === "unavailable";
  const avail = availabilityConfig[doctor.availability];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(doctor.id)}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-all",
        selected
          ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 ring-1 ring-[var(--color-brand-primary)]/30"
          : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          selected ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]"
        )}
      >
        {getInitials(doctor.name)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-[var(--color-text-primary)]">{doctor.name}</p>
          <Badge variant={avail.variant} className="text-[10px]">
            {avail.label}
          </Badge>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">{doctor.specialty}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-disabled)]">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[var(--color-status-borderline-icon)] text-[var(--color-status-borderline-icon)]" />
            {doctor.rating} ({doctor.reviewCount})
          </span>
          <span>Next: {formatRelative(doctor.nextAvailable)}</span>
        </div>
        {doctor.bio && (
          <p className="mt-2 line-clamp-2 text-xs text-[var(--color-text-secondary)]">{doctor.bio}</p>
        )}
      </div>
    </button>
  );
});
