"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FlaskConical,
  MessageSquare,
  Pill,
} from "lucide-react";
import { getNotificationHref } from "@/lib/notification-routes";
import type { Notification } from "@/types";
import { cn, formatRelative } from "@/lib/utils";

const ICONS = {
  appointment: Calendar,
  result: FlaskConical,
  prescription: Pill,
  message: MessageSquare,
} as const;

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onNavigate?: () => void;
  className?: string;
}

export const NotificationItem = memo(function NotificationItem({
  notification,
  onRead,
  onNavigate,
  className,
}: NotificationItemProps) {
  const router = useRouter();
  const Icon = ICONS[notification.type];
  const href = getNotificationHref(notification);

  const handleClick = useCallback(() => {
    if (!notification.read) onRead?.(notification.id);
    onNavigate?.();
    router.push(href);
  }, [notification.read, notification.id, onRead, onNavigate, href, router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-md)] p-3 text-left transition-colors hover:bg-[var(--color-surface-muted)]",
        !notification.read && "bg-[var(--color-surface-muted)]/50",
        className
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          notification.read
            ? "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]"
            : "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm",
              notification.read
                ? "text-[var(--color-text-secondary)]"
                : "font-semibold text-[var(--color-text-primary)]"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand-primary)]" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
          {notification.body}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-disabled)]">
          {formatRelative(notification.createdAt)}
        </p>
      </div>
    </button>
  );
});
