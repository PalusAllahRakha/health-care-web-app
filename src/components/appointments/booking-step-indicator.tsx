"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";
import type { BookingStep } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { key: BookingStep; label: string }[] = [
  { key: "specialty", label: "Specialty" },
  { key: "doctor", label: "Doctor" },
  { key: "datetime", label: "Date & time" },
  { key: "confirm", label: "Confirm" },
];

export function BookingStepIndicator({ current }: { current: BookingStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="mb-6 w-full">
      <div className="flex w-full items-start">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;

          return (
            <Fragment key={step.key}>
              <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    done && "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white",
                    active &&
                      "border-[var(--color-brand-primary)] bg-[var(--color-surface-elevated)] text-[var(--color-brand-primary)] ring-4 ring-[var(--color-brand-primary)]/10",
                    !done &&
                      !active &&
                      "border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-[var(--color-text-disabled)]"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-center text-[10px] font-medium uppercase tracking-wide",
                    active ? "text-[var(--color-brand-primary)]" : "text-[var(--color-text-disabled)]"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className="flex flex-1 items-center self-start px-1 pt-4">
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full transition-colors duration-300",
                      index < currentIndex
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-border-subtle)]"
                    )}
                    aria-hidden
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
