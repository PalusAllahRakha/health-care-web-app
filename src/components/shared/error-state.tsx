import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  backLabel?: string;
  backHref?: string;
  className?: string;
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  backLabel = "Go back",
  backHref = "/dashboard",
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-status-critical-border)] bg-[var(--color-status-critical-bg)]/40 px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-status-critical-bg)] text-[var(--color-status-critical-icon)]">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[var(--color-status-critical-text)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}
      {backHref && (
        <Button asChild variant="outline" className="mt-6">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      )}
    </div>
  );
}
