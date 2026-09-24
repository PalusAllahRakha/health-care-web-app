import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-11 min-w-11 px-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-primary)] text-[var(--color-brand-on-primary)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-brand-primary-hover)] active:scale-[0.98]",
        accent:
          "bg-[var(--color-brand-primary)] text-[var(--color-brand-on-primary)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-brand-primary-hover)] active:scale-[0.98]",
        secondary:
          "bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)]",
        outline:
          "border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]",
        ghost:
          "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]",
        destructive:
          "bg-[var(--color-status-critical)] text-white hover:opacity-90",
        link: "text-[var(--color-brand-primary)] underline-offset-4 hover:underline min-h-11 min-w-0 px-0",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 min-h-9 rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 min-h-12 rounded-[var(--radius-lg)] px-6 text-base",
        icon: "h-11 w-11 min-h-11 min-w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
