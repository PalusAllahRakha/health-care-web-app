"use client";

import { memo } from "react";
import type { Message } from "@/types";
import { cn, formatRelative } from "@/lib/utils";

export interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  className,
}: MessageBubbleProps) {
  const isPatient = message.isPatient;

  return (
    <div
      className={cn(
        "flex",
        isPatient ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2.5",
          isPatient
            ? "rounded-br-[var(--radius-sm)] bg-[var(--color-brand-primary)] text-white"
            : "rounded-bl-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]"
        )}
      >
        {!isPatient && (
          <p className="mb-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {message.senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.body}</p>
        <p
          className={cn(
            "mt-1 text-xs",
            isPatient ? "text-white/70" : "text-[var(--color-text-disabled)]"
          )}
        >
          {formatRelative(message.sentAt)}
        </p>
      </div>
    </div>
  );
});
