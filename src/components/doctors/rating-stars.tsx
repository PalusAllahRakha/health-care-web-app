"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, max = 5, size = "sm", className }: RatingStarsProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`Rating: ${rating} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              iconSize,
              filled || half
                ? "fill-amber-400 text-amber-400"
                : "text-[var(--color-border-strong)]"
            )}
            aria-hidden
          />
        );
      })}
      <span className="ml-1 text-sm text-[var(--color-text-secondary)] tabular-nums">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
