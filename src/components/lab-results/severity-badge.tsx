"use client";

import { memo } from "react";
import { AlertCircle, CheckCircle2, MinusCircle } from "lucide-react";
import type { SeverityFlag } from "@/types";
import { cn, severityColor } from "@/lib/utils";

const LABELS: Record<SeverityFlag, string> = {
  normal: "Normal",
  borderline: "Borderline",
  critical: "Critical",
};

const ICONS = {
  normal: CheckCircle2,
  borderline: MinusCircle,
  critical: AlertCircle,
} as const;

export interface SeverityBadgeProps {
  flag: SeverityFlag;
  className?: string;
}

export const SeverityBadge = memo(function SeverityBadge({
  flag,
  className,
}: SeverityBadgeProps) {
  const colors = severityColor(flag);
  const Icon = ICONS[flag];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        colors.bg,
        colors.border,
        colors.text,
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", colors.icon)} aria-hidden />
      {LABELS[flag]}
    </span>
  );
});
