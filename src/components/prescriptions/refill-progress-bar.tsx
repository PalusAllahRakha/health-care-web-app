"use client";

import { getProgressPercent } from "@/lib/refill-utils";
import type { RefillRequest } from "@/types";
import { cn } from "@/lib/utils";

interface RefillProgressBarProps {
  request: RefillRequest;
  showLabel?: boolean;
  className?: string;
}

export function RefillProgressBar({ request, showLabel = true, className }: RefillProgressBarProps) {
  const percent = getProgressPercent(request.status, request.type);
  const isReady = request.status === "ready_for_pickup";

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[var(--color-text-secondary)]">Progress</span>
          <span
            className={cn(
              "font-semibold tabular-nums",
              isReady ? "text-[var(--color-status-normal-text)]" : "text-[var(--color-brand-primary)]"
            )}
          >
            {percent}%
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isReady ? "bg-[var(--color-status-normal-icon)]" : "bg-[var(--color-brand-primary)]"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
