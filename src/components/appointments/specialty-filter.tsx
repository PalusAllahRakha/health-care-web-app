"use client";

import { useCallback, useMemo } from "react";
import { doctors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface SpecialtyFilterProps {
  onChange: (specialty: string) => void;
  value?: string;
  selected?: string;
  specialties?: string[];
  className?: string;
}

export function SpecialtyFilter({
  value,
  selected,
  specialties: specialtiesProp,
  onChange,
  className,
}: SpecialtyFilterProps) {
  const specialties = useMemo(() => {
    const list = specialtiesProp ?? [...new Set(doctors.map((d) => d.specialty))].sort();
    return ["all", ...list];
  }, [specialtiesProp]);

  const activeValue = selected ?? value ?? "all";

  const handleSelect = useCallback(
    (specialty: string) => onChange(specialty),
    [onChange]
  );

  return (
    <div className={cn("flex flex-wrap gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-2 shadow-[var(--shadow-subtle)]", className)} role="group" aria-label="Filter by specialty">
      {specialties.map((specialty) => {
        const isActive = activeValue === specialty;
        const label = specialty === "all" ? "All specialties" : specialty;
        return (
          <button
            key={specialty}
            type="button"
            onClick={() => handleSelect(specialty)}
            className={cn(
              "cursor-pointer rounded-[var(--radius-md)] px-3.5 py-2 text-sm font-medium transition-all",
              isActive
                ? "bg-[var(--color-brand-primary)] text-white shadow-[var(--shadow-glow)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
