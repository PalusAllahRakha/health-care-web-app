"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AnimatedTabOption<T extends string = string> {
  value: T;
  label: ReactNode;
  icon?: LucideIcon;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface AnimatedTabsProps<T extends string = string> {
  value: T;
  options: AnimatedTabOption<T>[];
  onValueChange: (value: T) => void;
  /** Unique id so multiple tab bars on a page don't share one pill. */
  layoutId: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  ariaLabel?: string;
  /** `equal` fills width; `hug` sizes to content and can wrap. */
  fit?: "equal" | "hug";
  size?: "sm" | "md";
}

export function AnimatedTabs<T extends string = string>({
  value,
  options,
  onValueChange,
  layoutId,
  className,
  listClassName,
  triggerClassName,
  ariaLabel = "Tabs",
  fit = "equal",
  size = "md",
}: AnimatedTabsProps<T>) {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "gap-1 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-1",
        fit === "equal" ? "grid w-full" : "inline-flex max-w-full flex-wrap",
        size === "sm" ? "min-h-10" : "min-h-12",
        className,
        listClassName
      )}
      style={
        fit === "equal"
          ? { gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative z-0 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:pointer-events-none disabled:opacity-50",
              fit === "equal" ? "h-full min-h-0 w-full" : "min-h-8",
              size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
              selected
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              triggerClassName
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 z-0 rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-subtle)]"
                transition={getSpring(reduced)}
              />
            )}
            {Icon ? <Icon className="relative z-10 size-3.5 shrink-0" aria-hidden /> : null}
            <span className="relative z-10 truncate">{option.label}</span>
            {option.badge != null ? (
              <span className="relative z-10 rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--color-text-secondary)]">
                {option.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
