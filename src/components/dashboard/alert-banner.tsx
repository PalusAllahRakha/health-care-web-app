"use client";

import { memo } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import type { LabResult } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AlertBannerVariant = "warning" | "critical";

export interface AlertBannerProps {
  results?: LabResult[];
  title?: string;
  message?: string;
  variant?: AlertBannerVariant;
  onViewResults?: () => void;
  href?: string;
  className?: string;
}

export const AlertBanner = memo(function AlertBanner({
  results,
  title,
  message,
  variant = "warning",
  onViewResults,
  href,
  className,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const criticalResults = results?.filter((r) => r.flag === "critical") ?? [];
  const isCriticalResultsMode = criticalResults.length > 0;

  const displayTitle =
    title ?? (isCriticalResultsMode ? "Critical lab results require attention" : "");
  const displayMessage =
    message ??
    (isCriticalResultsMode
      ? `${criticalResults.map((r) => r.testName).join(", ")} — please contact your provider.`
      : "");

  if (dismissed) return null;
  if (!displayTitle && !displayMessage) return null;

  const isCritical = variant === "critical" || isCriticalResultsMode;

  return (
    <div
      role="alert"
      className={cn(
        "relative flex flex-col gap-3 rounded-[var(--radius-md)] border p-4 pr-12 lg:flex-row lg:items-center lg:justify-between",
        isCritical
          ? "border-[var(--color-status-critical-border)] bg-[var(--color-status-critical-bg)]"
          : "border-[var(--color-status-borderline-border)] bg-[var(--color-status-borderline-bg)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            isCritical
              ? "text-[var(--color-status-critical-icon)]"
              : "text-[var(--color-status-borderline-icon)]"
          )}
          aria-hidden
        />
        <div>
          <p
            className={cn(
              "text-sm font-semibold",
              isCritical
                ? "text-[var(--color-status-critical-text)]"
                : "text-[var(--color-text-primary)]"
            )}
          >
            {displayTitle}
          </p>
          <p
            className={cn(
              "mt-1 text-xs leading-relaxed",
              isCritical
                ? "text-[var(--color-status-critical-text)]"
                : "text-[var(--color-text-secondary)]"
            )}
          >
            {displayMessage}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-8 lg:pl-0">
        {href && !onViewResults && (
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-[var(--color-status-critical-text)] hover:bg-[var(--color-status-critical-border)]/40">
            <Link href={href}>Review result<ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        )}
        {onViewResults && (
          <Button variant="outline" size="sm" onClick={onViewResults}>
            View results
          </Button>
        )}
        {!isCriticalResultsMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className="absolute right-2 top-2 h-8 w-8 text-[var(--color-text-secondary)] lg:top-1/2 lg:-translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
