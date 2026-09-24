"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, CheckCheck, Inbox, X } from "lucide-react";
import { notificationGroups, notifications as defaultNotifications } from "@/lib/mock-data";
import { useNotificationStore } from "@/stores/notification-store";
import { NotificationItem } from "@/components/notifications/notification-item";
import { EmptyState } from "@/components/shared/empty-state";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { drawerSlide, getTransition, overlayFade } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

export interface NotificationCenterProps {
  notifications?: Notification[];
  mode?: "drawer" | "page";
  className?: string;
}

type NotificationTab = "all" | Notification["type"];

export function NotificationCenter({
  notifications: notificationsProp,
  mode = "drawer",
  className,
}: NotificationCenterProps) {
  const { isOpen, close, markAllRead, unreadCount } = useNotificationStore();
  const [items, setItems] = useState<Notification[]>(
    notificationsProp ?? defaultNotifications
  );
  const [tab, setTab] = useState<NotificationTab>("all");
  const reduced = useReducedMotion() ?? false;
  const transition = getTransition(reduced);

  const grouped = useMemo(() => {
    return notificationGroups.map((group) => ({
      ...group,
      notifications: items.filter((n) => n.type === group.type),
    }));
  }, [items]);

  const tabOptions = useMemo(
    () => [
      { value: "all" as const, label: "All" },
      ...grouped.map((g) => ({ value: g.type as NotificationTab, label: g.label })),
    ],
    [grouped]
  );

  const visibleItems = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => n.type === tab);
  }, [items, tab]);

  const handleRead = useCallback((id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleNavigate = useCallback(() => {
    if (mode === "drawer") close();
  }, [mode, close]);

  const handleMarkAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllRead();
  }, [markAllRead]);

  const content = (
    <>
      <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
            <Bell className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-[var(--color-text-secondary)]">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleMarkAllRead} aria-label="Mark all read">
            <CheckCheck className="h-4 w-4" />
          </Button>
          {mode === "drawer" && (
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close notifications">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mx-4 mt-3">
          <AnimatedTabs
            value={tab}
            onValueChange={setTab}
            options={tabOptions}
            layoutId={`notifications-tabs-${mode}`}
            ariaLabel="Filter notifications"
            fit="hug"
            size="sm"
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={transition}
            >
              {visibleItems.length > 0 ? (
                <div className="space-y-0.5 p-2">
                  {visibleItems.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={handleRead}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Inbox}
                  title="No notifications"
                  description="You're all caught up in this category."
                  className="m-4 border-none bg-transparent"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );

  if (mode === "page") {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-subtle),var(--shadow-inset)]",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            variants={overlayFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={getTransition(reduced)}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            className={cn(
              "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-elevated)]",
              className
            )}
            role="dialog"
            aria-label="Notifications"
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={getTransition(reduced)}
          >
            {content}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
