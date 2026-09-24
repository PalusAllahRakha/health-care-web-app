"use client";

import { HealthSpinner } from "@/components/shared/health-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SectionLoaderProps {
  label?: string;
  sublabel?: string;
  className?: string;
  minHeight?: string;
  variant?: "card" | "inline" | "overlay";
}

export function SectionLoader({
  label = "Loading",
  sublabel,
  className,
  minHeight = "min-h-[140px]",
  variant = "card",
}: SectionLoaderProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 py-2 text-sm text-[var(--color-text-secondary)]", className)}>
        <HealthSpinner />
        <span>{label}</span>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-[var(--color-surface-elevated)]/75 backdrop-blur-[2px]",
          className
        )}
      >
        <HealthSpinner size={22} />
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        {sublabel && <p className="text-xs text-[var(--color-text-disabled)]">{sublabel}</p>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "section-loader relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-muted)]/40 p-6",
        minHeight,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 loading-section-shimmer opacity-40" />
      <HealthSpinner size={22} />
      <div className="relative text-center">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        {sublabel && <p className="mt-0.5 text-xs text-[var(--color-text-disabled)]">{sublabel}</p>}
      </div>
      <div className="relative flex w-full max-w-[200px] gap-1.5">
        <Skeleton className="h-1.5 flex-1 rounded-full" />
        <Skeleton className="h-1.5 w-8 rounded-full" />
        <Skeleton className="h-1.5 flex-1 rounded-full" />
      </div>
    </div>
  );
}
