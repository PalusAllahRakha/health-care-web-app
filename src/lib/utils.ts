import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m);
  return format(d, "h:mm a");
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function daysUntil(date: string | Date) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export type Severity = "normal" | "borderline" | "critical";

export function severityColor(flag: Severity) {
  const map = {
    normal: {
      bg: "bg-[var(--color-status-normal-bg)]",
      border: "border-[var(--color-status-normal-border)]",
      text: "text-[var(--color-status-normal-text)]",
      icon: "text-[var(--color-status-normal-icon)]",
    },
    borderline: {
      bg: "bg-[var(--color-status-borderline-bg)]",
      border: "border-[var(--color-status-borderline-border)]",
      text: "text-[var(--color-status-borderline-text)]",
      icon: "text-[var(--color-status-borderline-icon)]",
    },
    critical: {
      bg: "bg-[var(--color-status-critical-bg)]",
      border: "border-[var(--color-status-critical-border)]",
      text: "text-[var(--color-status-critical-text)]",
      icon: "text-[var(--color-status-critical-icon)]",
    },
  };
  return map[flag];
}
