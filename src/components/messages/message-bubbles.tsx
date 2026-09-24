"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn, formatRelative } from "@/lib/utils";
import { fadeUp, getTransition, staggerFast } from "@/lib/motion";
import type { Message } from "@/types";

interface MessageBubblesProps {
  messages: Message[];
  className?: string;
}

export function MessageBubbles({ messages, className }: MessageBubblesProps) {
  const reduced = useReducedMotion() ?? false;

  if (messages.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--color-text-secondary)]">
        No messages yet. Start the conversation below.
      </p>
    );
  }

  return (
    <motion.div
      className={cn("flex flex-col gap-4", className)}
      variants={staggerFast}
      initial="hidden"
      animate="visible"
      transition={getTransition(reduced)}
    >
      {messages.map((msg) => (
        <motion.div key={msg.id} variants={fadeUp}>
          <MessageBubble msg={msg} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <div className={cn("flex flex-col gap-1", msg.isPatient ? "items-end" : "items-start")}>
      {!msg.isPatient && (
        <p className="px-1 text-xs font-medium text-[var(--color-text-disabled)]">{msg.senderName}</p>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-[var(--radius-xl)] px-4 py-3 text-sm shadow-[var(--shadow-subtle)]",
          msg.isPatient
            ? "rounded-br-sm bg-[var(--color-brand-primary)] text-white"
            : "rounded-bl-sm border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]"
        )}
      >
        <p className="leading-relaxed">{msg.body}</p>
        <p
          className={cn(
            "mt-2 text-[11px]",
            msg.isPatient ? "text-white/70" : "text-[var(--color-text-disabled)]"
          )}
        >
          {formatRelative(msg.sentAt)}
        </p>
      </div>
    </div>
  );
}
