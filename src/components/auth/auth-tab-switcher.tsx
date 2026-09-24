"use client";

import { AnimatedTabs, type AnimatedTabOption } from "@/components/ui/animated-tabs";

export type AuthTabOption<T extends string> = AnimatedTabOption<T>;

export interface AuthTabSwitcherProps<T extends string> {
  value: T;
  options: AuthTabOption<T>[];
  onValueChange: (value: T) => void;
  className?: string;
  layoutId?: string;
  ariaLabel?: string;
}

export function AuthTabSwitcher<T extends string>({
  value,
  options,
  onValueChange,
  className,
  layoutId = "auth-tab-pill",
  ariaLabel = "Authentication options",
}: AuthTabSwitcherProps<T>) {
  return (
    <AnimatedTabs
      value={value}
      options={options}
      onValueChange={onValueChange}
      layoutId={layoutId}
      className={className}
      ariaLabel={ariaLabel}
      fit="equal"
      size="md"
    />
  );
}
