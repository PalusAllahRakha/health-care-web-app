"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "@/lib/nav-utils";
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

export const MobileBottomNav = memo(function MobileBottomNav({ notificationCount = 3 }: { notificationCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role ?? "patient";
  const navGroups = getNavForRole(role);
  const allItems = useMemo(() => navGroups.flatMap((group) => group.items), [navGroups]);
  const allHrefs = useMemo(() => allItems.map((item) => item.href), [allItems]);
  const shortcuts = role === "patient"
    ? PATIENT_SHORTCUTS.map((href) => allItems.find((item) => item.href === href)!).filter(Boolean)
    : allItems.slice(0, 4);
  const isOtherPage = !shortcuts.some((item) => isNavItemActive(pathname, item.href, allHrefs));

  return (
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
        <ul className="mx-auto grid max-w-xl gap-1 py-2" style={{ gridTemplateColumns: `repeat(${shortcuts.length + 1}, minmax(0, 1fr))` }}>
          {shortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(pathname, item.href, allHrefs);

            return (
              <li key={item.href}>
                <Link href={item.href} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]", isActive ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]")} aria-current={isActive ? "page" : undefined}>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.7} aria-hidden />
                  <span className="max-w-full truncate">{SHORT_LABELS[item.href] ?? item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <DialogTrigger asChild>
              <button type="button" className={cn("flex min-h-12 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]", isOtherPage || menuOpen ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]")} aria-label="Open all navigation">
                <Menu className="h-5 w-5" strokeWidth={1.7} aria-hidden />
                <span>More</span>
              </button>
            </DialogTrigger>
          </li>
        </ul>
      </nav>

      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto p-5">
        <DialogHeader className="pr-11 text-left">
          <DialogTitle className="text-xl">Your workspace</DialogTitle>
          <DialogDescription>All your care and account tools in one place.</DialogDescription>
        </DialogHeader>
        <nav aria-label="All pages" className="space-y-5 py-2">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">{group.title}</p>
              <ul className="grid grid-cols-1 gap-1.5 min-[380px]:grid-cols-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isNavItemActive(pathname, item.href, allHrefs);
                  const badge = item.href === "/notifications" ? notificationCount : item.badge;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setMenuOpen(false)} aria-current={isActive ? "page" : undefined} className={cn("flex min-h-12 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]", isActive ? "bg-[var(--color-brand-primary)]/8 text-[var(--color-brand-primary)]" : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]")}>
                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                        <span className="min-w-0 flex-1">{item.label}</span>
                        {badge != null && badge > 0 && <span className="rounded-full bg-[var(--color-status-critical-bg)] px-1.5 py-0.5 text-[10px] text-[var(--color-status-critical)]">{badge > 99 ? "99+" : badge}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-secondary)]">Portal</span>
            <RoleSwitcher />
          </div>
          <Button variant="ghost" size="sm" className="min-h-11" onClick={() => { setMenuOpen(false); logout(); }}>
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
