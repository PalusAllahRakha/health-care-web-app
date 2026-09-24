"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const trendPositive = trend && trend.value >= 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "mt-2 text-xs font-medium",
              trendPositive
                ? "text-[var(--color-status-normal-text)]"
                : "text-[var(--color-status-critical-text)]"
            )}
          >
            {trendPositive ? "+" : ""}
            {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
