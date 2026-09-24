import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface SkeletonBlockProps {
  lines?: number;
  showAvatar?: boolean;
  showActions?: boolean;
  className?: string;
  index?: number;
}

export function SkeletonBlock({
  lines = 3,
  showAvatar = false,
  showActions = false,
  className,
  index = 0,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn(
        "loading-skeleton-item surface-panel rounded-[var(--radius-lg)] p-4",
        className
      )}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-3">
        {showAvatar && <Skeleton className="h-11 w-11 shrink-0 rounded-full" />}
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-4 w-2/5" />
          {Array.from({ length: lines }).map((_, lineIndex) => (
            <Skeleton
              key={lineIndex}
              className={cn("h-3", lineIndex === lines - 1 ? "w-3/5" : "w-full")}
              style={{ animationDelay: `${index * 70 + lineIndex * 40}ms` }}
            />
          ))}
        </div>
      </div>
      {showActions && (
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-28 rounded-[var(--radius-md)]" />
          <Skeleton className="h-10 w-28 rounded-[var(--radius-md)]" />
        </div>
      )}
    </div>
  );
}
