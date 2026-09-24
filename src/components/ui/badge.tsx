import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-medium leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]",
        secondary:
          "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
        outline:
          "border-[var(--color-border-strong)] text-[var(--color-text-primary)]",
        success:
          "border-[var(--color-status-normal-border)] bg-[var(--color-status-normal-bg)] text-[var(--color-status-normal-text)]",
        warning:
          "border-[var(--color-status-borderline-border)] bg-[var(--color-status-borderline-bg)] text-[var(--color-status-borderline-text)]",
        destructive:
          "border-[var(--color-status-critical-border)] bg-[var(--color-status-critical-bg)] text-[var(--color-status-critical-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
