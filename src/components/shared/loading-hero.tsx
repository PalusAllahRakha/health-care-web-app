"use client";

import { useEffect, useState } from "react";
import { Check, Shield } from "lucide-react";
import { HealthLoader } from "@/components/shared/health-loader";
import { cn } from "@/lib/utils";

const PROGRESS_STEPS = [
  { id: "connect", label: "Secure" },
  { id: "fetch", label: "Fetch" },
  { id: "render", label: "Display" },
];

export interface LoadingHeroProps {
  label: string;
  sublabel: string;
  status: string;
  className?: string;
  compact?: boolean;
}

export function LoadingHero({
  label,
  sublabel,
  status,
  className,
  compact = false,
}: LoadingHeroProps) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 94) return 12;
        const jump = p < 40 ? 6 : p < 75 ? 4 : 2;
        return Math.min(p + jump, 94);
      });
    }, 380);
    return () => window.clearInterval(id);
  }, []);

  const activeStep = progress < 35 ? 0 : progress < 72 ? 1 : 2;

  return (
    <div
      className={cn(
        "loading-hero loading-hero-shine relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)]",
        compact ? "p-5" : "p-6 sm:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 brand-gradient-soft opacity-60" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-brand-primary)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[var(--color-brand-secondary)]/10 blur-3xl" />

      <div
        className={cn(
          "relative flex flex-col items-center gap-5 text-center",
          !compact && "sm:flex-row sm:items-center sm:text-left"
        )}
      >
        <div className="loading-hero-glow relative flex size-[4.5rem] shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-elevated)]/90 shadow-[var(--shadow-medium),0_0_32px_rgb(13_148_136/0.18)] backdrop-blur-sm ring-1 ring-[var(--color-brand-primary)]/20">
          <HealthLoader size={compact ? "sm" : "md"} showLabel={false} />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className={cn("font-semibold tracking-tight text-[var(--color-text-primary)]", compact ? "text-base" : "text-lg sm:text-xl")}>
              {label}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{sublabel}</p>
          </div>

          <div className="flex items-center justify-center gap-2 sm:justify-start">
            {PROGRESS_STEPS.map((step, index) => {
              const done = index < activeStep;
              const active = index === activeStep;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                    done && "bg-[var(--color-status-normal-bg)] text-[var(--color-status-normal-text)]",
                    active && "brand-gradient text-white shadow-[var(--shadow-glow)]",
                    !done && !active && "bg-[var(--color-surface-muted)] text-[var(--color-text-disabled)]"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
                  {step.label}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                <div
                  className="loading-progress-fill h-full rounded-full brand-gradient transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="w-9 text-right text-xs font-bold tabular-nums text-[var(--color-brand-primary)]">
                {progress}%
              </span>
            </div>
            <p key={status} className="loading-status-text text-xs font-medium text-[var(--color-brand-primary)]">
              {status}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-disabled)] sm:justify-start">
            <Shield className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" />
            HIPAA-protected · Encrypted in transit
          </div>
        </div>
      </div>
    </div>
  );
}
