"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, HeartPulse, LogOut, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getActiveNavHref } from "@/lib/nav-utils";
import { getProfilePath, getRoleHomePath } from "@/lib/auth/roles";
import { useAuth } from "@/providers/auth-provider";
import { getNavForRole } from "./nav-config";
import { RoleSwitcher } from "./role-switcher";
import { ThemeToggle } from "./theme-toggle";

function getPageTitle(pathname: string, role: "patient" | "provider" | "admin"): string {
  if (pathname.startsWith("/notifications")) return "Notifications";
  const items = getNavForRole(role).flatMap((group) => group.items);
  const activeHref = getActiveNavHref(pathname, items.map((item) => item.href));
  return items.find((item) => item.href === activeHref)?.label ?? "HealthPortal";
}

export const Topbar = memo(function Topbar({ className, notificationCount = 3 }: { className?: string; notificationCount?: number }) {
  const { user, profile, logout } = useAuth();
  const pathname = usePathname();
  const role = user?.role ?? "patient";
  const pageTitle = getPageTitle(pathname, role);
  const profilePath = getProfilePath(role);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 px-3 backdrop-blur-xl sm:h-[76px] sm:gap-3 sm:px-6 lg:h-[88px] lg:px-8 xl:px-10",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <Link
          href={getRoleHomePath(role)}
          aria-label="HealthPortal home"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary)] text-[var(--color-brand-on-primary)] sm:h-11 sm:w-11 lg:hidden"
        >
          <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} aria-hidden />
        </Link>
        <div className="min-w-0">
          <p className="mb-1 hidden text-[11px] font-medium text-[var(--color-text-secondary)] lg:block">Your workspace</p>
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden text-sm capitalize text-[var(--color-text-secondary)] lg:inline">{role} portal</span>
            <ChevronRight className="hidden h-3.5 w-3.5 text-[var(--color-text-disabled)] lg:block" aria-hidden />
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{pageTitle}</p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
        <RoleSwitcher className="mr-1 hidden lg:flex" />
        {role === "patient" && (
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl text-[var(--color-text-secondary)]"
            asChild
            aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
          >
            <Link href="/notifications">
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.7} aria-hidden />
              {notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-status-critical)] px-1 text-[9px] font-semibold text-white ring-2 ring-[var(--color-surface-elevated)]">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Link>
          </Button>
        )}
        <ThemeToggle className="rounded-xl text-[var(--color-text-secondary)]" />
        <span className="mx-1 hidden h-7 w-px bg-[var(--color-border-subtle)] sm:mx-2 sm:block" aria-hidden />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] sm:min-h-11 sm:min-w-11 sm:gap-3"
              aria-label="Account menu"
            >
              <UserAvatar name={user?.name ?? "User"} avatarUrl={profile?.avatarUrl} className="h-8 w-8 sm:h-9 sm:w-9" />
              <span className="hidden max-w-32 truncate text-sm font-semibold text-[var(--color-text-primary)] xl:block">
                {user?.name.split(" ")[0] ?? "Your profile"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{user?.name ?? "Account"}</p>
              <p className="mt-0.5 truncate text-xs capitalize text-[var(--color-text-secondary)]">{role} account</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={profilePath} className="cursor-pointer">
                <UserRound className="h-4 w-4" aria-hidden />
                View profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-[var(--color-status-critical)] focus:bg-[var(--color-status-critical-bg)] focus:text-[var(--color-status-critical-text)]"
              onSelect={() => logout()}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});
