"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, FlaskConical, MessageSquare, Pill } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardsProps {
  upcoming: number;
  criticalLabs: number;
  refillsDue: number;
  unreadMessages: number;
  className?: string;
}

const statConfig = [
  { key: "upcoming" as const, label: "Upcoming visits", detail: "On your calendar", icon: CalendarDays, href: "/appointments" },
  { key: "criticalLabs" as const, label: "Critical results", detail: "Review with your provider", icon: FlaskConical, href: "/lab-results" },
  { key: "refillsDue" as const, label: "Refills due", detail: "Manage your prescriptions", icon: Pill, href: "/prescriptions" },
  { key: "unreadMessages" as const, label: "Unread messages", detail: "From your care team", icon: MessageSquare, href: "/messages" },
];

export function StatCards({ upcoming, criticalLabs, refillsDue, unreadMessages, className }: StatCardsProps) {
  const values = { upcoming, criticalLabs, refillsDue, unreadMessages };

  return (
    <div className={cn("grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] lg:grid-cols-4", className)}>
      {statConfig.map(({ key, label, detail, icon: Icon, href }, index) => (
        <Link
          key={key}
          href={href}
          className={cn(
            "group relative min-w-0 p-4 transition-colors hover:bg-[var(--color-surface-muted)]/60 sm:p-5 lg:p-6",
            index % 2 === 0 && "border-r border-[var(--color-border-subtle)]",
            index < 2 && "border-b border-[var(--color-border-subtle)] lg:border-b-0",
            index === 1 && "lg:border-r"
          )}
        >
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-xs font-medium sm:text-sm">{label}</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className={cn("text-[2rem] font-semibold leading-none tracking-tight tabular-nums sm:text-4xl", key === "criticalLabs" && values[key] > 0 ? "text-[var(--color-status-critical-text)]" : "text-[var(--color-text-primary)]")}>
              {values[key].toString().padStart(2, "0")}
            </span>
            <ArrowUpRight className="h-4 w-4 text-[var(--color-text-disabled)] transition-colors group-hover:text-[var(--color-brand-primary)]" aria-hidden />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">{detail}</p>
        </Link>
      ))}
    </div>
  );
}
