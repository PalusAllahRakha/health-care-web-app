"use client";

import {
  Activity,
  Brain,
  Eye,
  Heart,
  Smile,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { doctors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  Cardiology: Heart,
  Dermatology: Smile,
  Pediatrics: Smile,
  Orthopedics: Activity,
  Neurology: Brain,
  Psychiatry: Brain,
  "Internal Medicine": Stethoscope,
  Ophthalmology: Eye,
};

function getIcon(specialty: string): LucideIcon {
  return SPECIALTY_ICONS[specialty] ?? Stethoscope;
}

export interface BookingSpecialtyGridProps {
  selected: string;
  onChange: (specialty: string) => void;
}

export function BookingSpecialtyGrid({ selected, onChange }: BookingSpecialtyGridProps) {
  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
  const counts = Object.fromEntries(
    specialties.map((s) => [s, doctors.filter((d) => d.specialty === s).length])
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {specialties.map((specialty) => {
        const Icon = getIcon(specialty);
        const isActive = selected === specialty;
        return (
          <button
            key={specialty}
            type="button"
            onClick={() => onChange(specialty)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-all cursor-pointer",
              isActive
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/8 shadow-[var(--shadow-subtle)]"
                : "border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
                isActive ? "bg-[var(--color-brand-primary)] text-white" : "bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{specialty}</p>
              <p className="text-xs text-[var(--color-text-disabled)]">
                {counts[specialty]} provider{counts[specialty] === 1 ? "" : "s"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
