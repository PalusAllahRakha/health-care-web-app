"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, getTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-6 py-16 text-center",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={getTransition(reduced)}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] ">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="relative mt-6 text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Button asChild className="relative mt-7">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button onClick={onAction} className="relative mt-7">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
