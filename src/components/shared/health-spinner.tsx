"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface HealthSpinnerProps {
  className?: string;
  size?: number;
}

export function HealthSpinner({ className, size = 18 }: HealthSpinnerProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `hs-g-${uid}`;

  return (
    <span role="status" aria-label="Loading" className={cn("inline-flex shrink-0", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="health-spinner"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-primary)" />
            <stop offset="100%" stopColor="var(--color-brand-secondary)" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="20 40"
          fill="none"
          className="health-spin"
        />
        <path
          d="M12 8.5 C12 6.5 9.5 6 9.5 8 C9.5 9.5 11 11 12 13 C13 11 14.5 9.5 14.5 8 C14.5 6 12 6.5 12 8.5Z"
          fill={`url(#${gradId})`}
          className="health-heartbeat"
          transform="translate(0, 1)"
        />
      </svg>
    </span>
  );
}
