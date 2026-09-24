"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, FlaskConical, MessageSquare, Pill } from "lucide-react";
import { notifications } from "@/lib/mock-data";
import { getNotificationHref } from "@/lib/notification-routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ICONS = {
  appointment: CalendarDays,
  result: FlaskConical,
  message: MessageSquare,
  prescription: Pill,
} as const;

export interface ActivityFeedProps {
  limit?: number;
  className?: string;
}

export function ActivityFeed({ limit = 4, className }: ActivityFeedProps) {
  const items = [...notifications]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-5 pb-2 sm:p-6 sm:pb-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Recent updates</h2>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">The latest from your care team</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="-mr-2 shrink-0 text-[var(--color-text-secondary)]">
          <Link href="/notifications">View all<ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
        <ul>
          {items.map((item, index) => {
            const Icon = ICONS[item.type];
            return (
              <li key={item.id} className={cn(index > 0 && "border-t border-[var(--color-border-subtle)]")}>
                <Link href={getNotificationHref(item)} className="group flex items-start gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-[var(--color-surface-muted)]/60 sm:gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium transition-colors group-hover:text-[var(--color-brand-primary)]">{item.title}</p>
                      {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-primary)]"><span className="sr-only">Unread</span></span>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">{item.body}</p>
                  </div>
                  <time dateTime={item.createdAt} className="mt-0.5 shrink-0 text-[11px] text-[var(--color-text-secondary)]">
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </time>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
