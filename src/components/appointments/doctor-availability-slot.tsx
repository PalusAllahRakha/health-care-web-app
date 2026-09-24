"use client";

import { memo, useCallback } from "react";
import { cn, formatTime } from "@/lib/utils";

export interface DoctorAvailabilitySlotProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect: (time: string) => void;
  className?: string;
}

export const DoctorAvailabilitySlot = memo(function DoctorAvailabilitySlot({
  time,
  selected = false,
  disabled = false,
  onSelect,
  className,
}: DoctorAvailabilitySlotProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onSelect(time);
  }, [disabled, onSelect, time]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={selected}
      className={cn(
        "min-h-11 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]",
        selected
          ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white shadow-[var(--shadow-subtle)]"
          : "border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)]/40 hover:bg-[var(--color-surface-muted)]",
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {formatTime(time)}
    </button>
  );
});
