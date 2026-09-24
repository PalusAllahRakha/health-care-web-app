"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
      duration={4500}
      expand
      gap={10}
      toastOptions={{
        classNames: {
          toast:
            "border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] shadow-[var(--shadow-elevated)]",
          title: "font-semibold",
          description: "text-[var(--color-text-secondary)]",
          success:
            "border-[var(--color-status-normal-border)]! bg-[var(--color-status-normal-bg)]! text-[var(--color-status-normal-text)]!",
          error:
            "border-[var(--color-status-critical-border)]! bg-[var(--color-status-critical-bg)]! text-[var(--color-status-critical-text)]!",
          warning:
            "border-[var(--color-status-borderline-border)]! bg-[var(--color-status-borderline-bg)]! text-[var(--color-status-borderline-text)]!",
          closeButton:
            "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]",
        },
      }}
    />
  );
}

export { toast };
