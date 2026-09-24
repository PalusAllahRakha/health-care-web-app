"use client";

import { AlertTriangle, CheckCircle2, Clock, Package, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrescriptionSummaryProps {
  total: number;
  refillsDue: number;
  inProgress: number;
  ready: number;
  className?: string;
}

const items = [
  { key: "total", label: "Active medications", icon: Pill, accent: "stat-accent-brand" },
  { key: "refillsDue", label: "Need attention", icon: AlertTriangle, accent: "stat-accent-warning" },
  { key: "inProgress", label: "In progress", icon: Clock, accent: "stat-accent-info" },
  { key: "ready", label: "Ready now", icon: Package, accent: "stat-accent-brand" },
] as const;

export function PrescriptionSummary({
  total,
  refillsDue,
  inProgress,
  ready,
  className,
}: PrescriptionSummaryProps) {
  const values = { total, refillsDue, inProgress, ready };

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {items.map(({ key, label, icon: Icon, accent }) => (
        <div key={key} className={accent}>
          <div className="stat-card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
                {values[key]}
              </p>
              <p className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</p>
            </div>
            {key === "ready" && ready > 0 && (
              <CheckCircle2 className="ml-auto h-5 w-5 text-[var(--color-status-normal-icon)]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
