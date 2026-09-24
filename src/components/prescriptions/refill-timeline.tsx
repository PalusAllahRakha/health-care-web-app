"use client";

import { Check, Circle } from "lucide-react";
import { getRefillSteps, getStatusIndex } from "@/lib/refill-utils";
import type { RefillRequest } from "@/types";
import { cn } from "@/lib/utils";

interface RefillTimelineProps {
  request: RefillRequest;
  compact?: boolean;
  className?: string;
}

export function RefillTimeline({ request, compact = false, className }: RefillTimelineProps) {
  const steps = getRefillSteps(request.type);
  const activeIndex = getStatusIndex(request.status, request.type);

  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;

        return (
          <li key={step.key} className={cn("flex gap-3", !compact && "pb-4 last:pb-0")}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  done && "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white",
                  active &&
                    "border-[var(--color-brand-primary)] bg-[var(--color-surface-elevated)] text-[var(--color-brand-primary)]",
                  !done && !active && "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-disabled)]"
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : active ? (
                  <Circle className="h-2 w-2 fill-current" />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </div>
              {!compact && index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 min-h-6 rounded-full",
                    index < activeIndex ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-border-subtle)]"
                  )}
                />
              )}
            </div>
            <div className={cn("min-w-0", compact ? "pt-0.5" : "pt-0")}>
              <p
                className={cn(
                  compact ? "text-xs" : "text-sm",
                  "font-medium",
                  active || done ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-disabled)]"
                )}
              >
                {step.label}
              </p>
              {active && !compact && (
                <p className="mt-0.5 text-xs text-[var(--color-brand-primary)]">In progress</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
