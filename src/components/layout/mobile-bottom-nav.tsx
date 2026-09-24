"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "@/lib/nav-utils";
import { getProfilePath } from "@/lib/auth/roles";
import { useAuth } from "@/providers/auth-provider";
import { getNavForRole } from "./nav-config";
import { RoleSwitcher } from "./role-switcher";

const PATIENT_SHORTCUTS = ["/dashboard", "/appointments", "/lab-results", "/messages"];
const SHORT_LABELS: Record<string, string> = {
  "/dashboard": "Home",
  "/appointments": "Visits",
  "/lab-results": "Results",
  "/provider/patients": "Patients",
};

export const MobileBottomNav = memo(function MobileBottomNav({
  notificationCount = 3,
}: {
  notificationCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, profile } = useAuth();
  const role = user?.role ?? "patient";
  const profilePath = getProfilePath(role);
  const navGroups = getNavForRole(role);
  const allItems = useMemo(() => navGroups.flatMap((group) => group.items), [navGroups]);
  const allHrefs = useMemo(() => allItems.map((item) => item.href), [allItems]);
  const shortcuts =
    role === "patient"
      ? PATIENT_SHORTCUTS.map((href) => allItems.find((item) => item.href === href)!).filter(Boolean)
      : allItems.slice(0, 4);
  const isOtherPage = !shortcuts.some((item) => isNavItemActive(pathname, item.href, allHrefs));

  return (
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:px-3 lg:hidden"
        aria-label="Mobile navigation"
      >
        <ul
          className="mx-auto grid max-w-xl gap-0.5 py-1.5 sm:gap-1 sm:py-2"
          style={{ gridTemplateColumns: `repeat(${shortcuts.length + 1}, minmax(0, 1fr))` }}
        >
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(pathname, item.href, allHrefs);

            return (
              <li key={item.href} className="min-w-0">
                <Link
                  href={item.href}
                  className={cn(
                    "flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[10px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] sm:min-h-12 sm:gap-1 sm:px-1 sm:py-1.5",
                    isActive
                      ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2 : 1.7} aria-hidden />
                  <span className="max-w-full truncate">{SHORT_LABELS[item.href] ?? item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0">
            <DialogTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex min-h-11 w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-[10px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] sm:min-h-12 sm:gap-1 sm:px-1 sm:py-1.5",
                  isOtherPage || menuOpen
                    ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]"
                )}
                aria-label="Open menu for more pages and sign out"
              >
                <Menu className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden />
                <span>More</span>
              </button>
            </DialogTrigger>
          </li>
        </ul>
      </nav>

      <DialogContent className="flex max-h-[min(92dvh,40rem)] w-[calc(100%-1.5rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]">
        <DialogHeader className="shrink-0 space-y-1 border-b border-[var(--color-border-subtle)] p-5 pr-14 text-left">
          <DialogTitle className="text-xl">Your workspace</DialogTitle>
          <DialogDescription>All your care and account tools in one place.</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="shrink-0 border-b border-[var(--color-border-subtle)] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} avatarUrl={profile?.avatarUrl} className="h-11 w-11" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs capitalize text-[var(--color-text-secondary)]">{role} account</p>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0" asChild>
                <Link href={profilePath} onClick={() => setMenuOpen(false)}>
                  <UserRound className="h-4 w-4" aria-hidden />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        )}

        <nav aria-label="All pages" className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                {group.title}
              </p>
              <ul className="grid grid-cols-1 gap-1.5 min-[380px]:grid-cols-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isNavItemActive(pathname, item.href, allHrefs);
                  const badge = item.href === "/notifications" ? notificationCount : item.badge;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]",
                          isActive
                            ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]"
                            : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                        <span className="min-w-0 flex-1">{item.label}</span>
                        {badge != null && badge > 0 && (
                          <span className="rounded-full bg-[var(--color-status-critical-bg)] px-1.5 py-0.5 text-[10px] text-[var(--color-status-critical)]">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--color-text-secondary)]">Demo portal</span>
            <RoleSwitcher />
          </div>
          <Button
            variant="secondary"
            className="h-11 w-full justify-center gap-2 border border-[var(--color-border-subtle)]"
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
