"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: 56,
  md: 72,
  lg: 96,
} as const;

export interface HealthLoaderProps {
  size?: keyof typeof SIZES;
  label?: string;
  sublabel?: string;
  className?: string;
  showLabel?: boolean;
}

export function HealthLoader({
  size = "md",
  label = "Loading your health data",
  sublabel = "Please wait a moment",
  className,
  showLabel = true,
}: HealthLoaderProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `hl-g-${uid}`;
  const trackId = `hl-t-${uid}`;
  const glowId = `hl-glow-${uid}`;
  const px = SIZES[size];
  const center = px / 2;
  const radius = px * 0.38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <div className="relative" style={{ width: px, height: px }}>
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-[var(--color-brand-primary)]/15 blur-xl health-loader-glow"
          aria-hidden
        />
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand-primary)" />
              <stop offset="55%" stopColor="var(--color-brand-secondary)" />
              <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-brand-secondary)" stopOpacity="0.08" />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${trackId})`}
            strokeWidth={px * 0.045}
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={px * 0.055}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.28} ${circumference * 0.72}`}
            className="health-spin"
            filter={`url(#${glowId})`}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          <circle
            cx={center}
            cy={center}
            r={radius * 0.72}
            fill="none"
            stroke="var(--color-brand-primary)"
            strokeOpacity="0.2"
            strokeWidth={px * 0.02}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.15} ${circumference * 0.85}`}
            className="health-spin-reverse"
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          <g
            className="health-heartbeat"
            style={{ transformOrigin: `${center}px ${center}px` }}
            filter={`url(#${glowId})`}
          >
            <path
              d={`M${center} ${center - px * 0.12}
                C${center} ${center - px * 0.2} ${center - px * 0.14} ${center - px * 0.22} ${center - px * 0.14} ${center - px * 0.1}
                C${center - px * 0.14} ${center} ${center - px * 0.05} ${center + px * 0.08} ${center} ${center + px * 0.16}
                C${center + px * 0.05} ${center + px * 0.08} ${center + px * 0.14} ${center} ${center + px * 0.14} ${center - px * 0.1}
                C${center + px * 0.14} ${center - px * 0.22} ${center} ${center - px * 0.2} ${center} ${center - px * 0.12}Z`}
              fill={`url(#${gradientId})`}
            />
          </g>
        </svg>
      </div>

      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
          {sublabel && (
            <p className="mt-1 text-xs text-[var(--color-text-disabled)]">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
