"use client";

import { useEffect, useState } from "react";
import { LoadingHero } from "@/components/shared/loading-hero";
import { SkeletonBlock } from "@/components/shared/skeleton-block";
import { cn } from "@/lib/utils";

export type PageLoadingVariant =
  | "dashboard"
  | "grid"
  | "list"
  | "detail"
  | "profile"
  | "table"
  | "messages";

const LABELS: Record<PageLoadingVariant, { label: string; sublabel: string }> = {
  dashboard: { label: "Loading your dashboard", sublabel: "Gathering care overview" },
  grid: { label: "Loading appointments", sublabel: "Fetching schedules & availability" },
  list: { label: "Loading records", sublabel: "Retrieving your health data" },
  detail: { label: "Loading details", sublabel: "Preparing clinical information" },
  profile: { label: "Loading profile", sublabel: "Syncing account settings" },
  table: { label: "Loading workspace", sublabel: "Fetching portal data" },
  messages: { label: "Loading messages", sublabel: "Securing your conversations" },
};

const STATUS_BY_VARIANT: Record<PageLoadingVariant, string[]> = {
  dashboard: ["Syncing vitals overview…", "Loading upcoming visits…", "Personalizing dashboard…"],
  grid: ["Checking provider availability…", "Loading calendar data…", "Preparing time slots…"],
  list: ["Querying health records…", "Organizing results…", "Almost ready…"],
  detail: ["Loading clinical details…", "Fetching related records…", "Rendering view…"],
  profile: ["Loading account data…", "Syncing preferences…", "Securing profile…"],
  table: ["Loading workspace metrics…", "Fetching user data…", "Building table view…"],
  messages: ["Decrypting messages…", "Loading threads…", "Preparing inbox…"],
};

export interface PageLoadingProps {
  variant?: PageLoadingVariant;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function PageLoading({
  variant = "list",
  label,
  sublabel,
  className,
}: PageLoadingProps) {
  const copy = LABELS[variant];
  const statuses = STATUS_BY_VARIANT[variant];
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStatusIndex((i) => (i + 1) % statuses.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [variant]);

  return (
    <div className={cn("space-y-5", className)} aria-busy="true">
      <LoadingHero
        label={label ?? copy.label}
        sublabel={sublabel ?? copy.sublabel}
        status={statuses[statusIndex]}
      />

      <div className="loading-skeleton-veil relative space-y-4">
        <div className="pointer-events-none absolute inset-0 z-[1] rounded-[var(--radius-lg)] bg-gradient-to-b from-transparent via-[var(--color-surface)]/20 to-[var(--color-surface)]/40" />
        <VariantSkeleton variant={variant} />
      </div>
    </div>
  );
}

function VariantSkeleton({ variant }: { variant: PageLoadingVariant }) {
  switch (variant) {
    case "dashboard":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} lines={2} index={i + 1} />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonBlock lines={4} index={5} />
            <SkeletonBlock lines={5} index={6} />
          </div>
        </>
      );
    case "grid":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <SkeletonBlock lines={2} index={1} />
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonBlock lines={8} index={2} />
            <SkeletonBlock lines={6} showActions index={3} />
          </div>
        </>
      );
    case "list":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} lines={2} showAvatar index={i + 1} />
            ))}
          </div>
        </>
      );
    case "detail":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <SkeletonBlock lines={6} showActions index={1} />
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonBlock lines={5} index={2} />
            <SkeletonBlock lines={4} index={3} />
          </div>
        </>
      );
    case "profile":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <SkeletonBlock lines={3} className="h-28" showAvatar index={1} />
          <SkeletonBlock lines={8} index={2} />
        </>
      );
    case "table":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} lines={2} index={i + 1} />
            ))}
          </div>
          <SkeletonBlock lines={8} showActions index={5} />
        </>
      );
    case "messages":
      return (
        <>
          <SkeletonBlock lines={1} className="h-16" index={0} />
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <SkeletonBlock lines={8} index={1} />
            <SkeletonBlock lines={10} showActions index={2} />
          </div>
        </>
      );
  }
}

export { HealthLoader } from "@/components/shared/health-loader";
export { HealthSpinner } from "@/components/shared/health-spinner";
export { SectionLoader } from "@/components/shared/section-loader";
export { LoadingHero } from "@/components/shared/loading-hero";
