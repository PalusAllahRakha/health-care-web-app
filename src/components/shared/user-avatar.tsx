"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({ name, avatarUrl, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn(avatarUrl && "bg-[var(--color-surface-muted)]", className)}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} className="object-contain" />
      ) : null}
      <AvatarFallback className={cn("bg-[var(--color-brand-primary)] text-xs font-bold text-white", fallbackClassName)}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
