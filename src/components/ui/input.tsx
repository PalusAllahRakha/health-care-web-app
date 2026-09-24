import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
      "flex h-11 min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-3.5 py-2 text-sm text-[var(--color-text-primary)] transition-[border-color,box-shadow] duration-[var(--duration-normal)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-disabled)] hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]/25 focus-visible:shadow-[var(--shadow-glow-soft)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
