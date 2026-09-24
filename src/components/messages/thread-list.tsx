"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MotionList, MotionListItem } from "@/components/motion/motion-list";
import type { MessageThread } from "@/types";
import { cn, formatRelative } from "@/lib/utils";

export interface ThreadListItemProps {
  thread: MessageThread;
  active?: boolean;
  onSelect?: (threadId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const ThreadListItem = memo(function ThreadListItem({
  thread,
  active = false,
  onSelect,
}: ThreadListItemProps) {
  const handleClick = useCallback(() => {
    onSelect?.(thread.id);
  }, [onSelect, thread.id]);

  const content = (
    <>
      <Avatar className="h-11 w-11 shrink-0 ring-2 ring-[var(--color-brand-primary)]/10">
        <AvatarFallback className="bg-[var(--color-brand-primary)]/10 text-xs font-bold text-[var(--color-brand-primary)]">
          {getInitials(thread.participantName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
            {thread.participantName}
          </p>
          <span className="shrink-0 text-xs text-[var(--color-text-disabled)]">
            {formatRelative(thread.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs font-medium text-[var(--color-brand-primary)]">{thread.participantRole}</p>
        <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">
          {thread.lastMessage}
        </p>
      </div>
      {thread.unread > 0 && (
        <Badge className="shrink-0 shadow-[var(--shadow-glow)]">{thread.unread}</Badge>
      )}
    </>
  );

  const className = cn(
    "flex w-full cursor-pointer items-start gap-3 p-4 text-left transition-all duration-200",
    active
      ? "bg-[var(--color-brand-primary)]/8 border-l-[3px] border-l-[var(--color-brand-primary)]"
      : "hover:bg-[var(--color-surface-muted)] border-l-[3px] border-l-transparent"
  );

  if (onSelect) {
    return (
      <button type="button" onClick={handleClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/messages/${thread.id}`} className={className}>
      {content}
    </Link>
  );
});

export interface ThreadListProps {
  threads: MessageThread[];
  activeThreadId?: string;
  onSelect?: (threadId: string) => void;
  className?: string;
}

export function ThreadList({ threads, activeThreadId, onSelect, className }: ThreadListProps) {
  return (
    <MotionList
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-subtle),var(--shadow-inset)] divide-y divide-[var(--color-border-subtle)]",
        className
      )}
      role="list"
    >
      {threads.map((thread) => (
        <MotionListItem key={thread.id}>
          <ThreadListItem
            thread={thread}
            active={thread.id === activeThreadId}
            onSelect={onSelect}
          />
        </MotionListItem>
      ))}
    </MotionList>
  );
}
