"use client";

import { useCallback, useMemo } from "react";
import { doctors } from "@/lib/mock-data";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
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

  const options = useMemo(
    () =>
      specialties.map((specialty) => ({
        value: specialty,
        label: specialty === "all" ? "All specialties" : specialty,
      })),
    [specialties]
  );

  const handleSelect = useCallback((specialty: string) => onChange(specialty), [onChange]);

  return (
    <AnimatedTabs
      value={activeValue}
      onValueChange={handleSelect}
      options={options}
      layoutId="appointments-specialty-tabs"
      ariaLabel="Filter by specialty"
      fit="hug"
      size="sm"
      className={cn("w-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] shadow-[var(--shadow-subtle)]", className)}
    />
  );
}
