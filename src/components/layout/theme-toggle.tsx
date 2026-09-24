"use client";

import { memo, useCallback, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

export const ThemeToggle = memo(function ThemeToggle({
  className,
}: {
  className?: string;
}) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative shrink-0", className)}
      aria-label={mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
      aria-pressed={mounted ? isDark : undefined}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          aria-hidden
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 ease-out",
            !mounted && "opacity-0",
            mounted && !isDark && "rotate-0 scale-100 opacity-100",
            mounted && isDark && "rotate-90 scale-0 opacity-0"
          )}
        />
        <Moon
          aria-hidden
          className={cn(
            "absolute h-5 w-5 transition-all duration-300 ease-out",
            !mounted && "opacity-0",
            mounted && isDark && "rotate-0 scale-100 opacity-100",
            mounted && !isDark && "-rotate-90 scale-0 opacity-0"
          )}
        />
      </span>
    </Button>
  );
});
