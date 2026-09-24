"use client";

import { memo, useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, HeartPulse, LogOut, Plus } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "@/lib/nav-utils";
import { getProfilePath, getRoleHomePath } from "@/lib/auth/roles";
import { useAuth } from "@/providers/auth-provider";
import { getNavForRole } from "./nav-config";

const STORAGE_KEY = "hp-sidebar-collapsed";
const COLLAPSE_EVENT = "hp-sidebar-change";

function subscribeToCollapse(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(COLLAPSE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(COLLAPSE_EVENT, onChange);
  };
}

function getCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export const Sidebar = memo(function Sidebar({ notificationCount = 3 }: { notificationCount?: number }) {
  const collapsed = useSyncExternalStore(subscribeToCollapse, getCollapsed, () => false);
  const pathname = usePathname();
  const { user, logout, profile } = useAuth();
  const role = user?.role ?? "patient";
  const navGroups = getNavForRole(role);
  const allHrefs = useMemo(() => navGroups.flatMap((group) => group.items.map((item) => item.href)), [navGroups]);

  const toggleCollapsed = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(!collapsed));
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  }, [collapsed]);

  const roleLabel = role === "admin" ? "Admin workspace" : role === "provider" ? "Provider workspace" : "Your health, connected";

  return (
    <aside
      className={cn(
        "hidden h-dvh shrink-0 flex-col bg-[#173c38] text-[#dce9e2] transition-[width] duration-300 lg:sticky lg:top-0 lg:flex dark:bg-[#102e2a]",
        collapsed ? "w-[5.25rem]" : "w-[16.5rem]"
      )}
      aria-label="Main navigation"
    >
      <div className={cn("flex h-[88px] shrink-0 items-center", collapsed ? "justify-center px-3" : "gap-2 px-5")}>
        <Link href={getRoleHomePath(role)} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#c7e7ce]" aria-label="HealthPortal home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c7e7ce] text-[#173c38]">
            <HeartPulse className="h-6 w-6" strokeWidth={1.8} aria-hidden />
          </span>
          {!collapsed && <span className="truncate text-[19px] font-semibold tracking-[-0.7px] text-white">HealthPortal<span className="text-[#b6d5bd]">.</span></span>}
        </Link>
        {!collapsed && (
          <Button variant="ghost" size="icon" className="-mr-3 h-11 w-11 shrink-0 text-[#bdd2c8] hover:bg-white/10 hover:text-white" onClick={toggleCollapsed} aria-label="Collapse sidebar">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex justify-center pb-3">
          <Button variant="ghost" size="icon" className="text-[#bdd2c8] hover:bg-white/10 hover:text-white" onClick={toggleCollapsed} aria-label="Expand sidebar">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : <p className="-mt-2 mb-7 px-5 text-xs text-[#b6ccc1]">{roleLabel}</p>}

      {role === "patient" && (
        <div className={cn("mb-6 px-4", collapsed && "flex justify-center px-3")}>
          <Button asChild size={collapsed ? "icon" : "default"} className={cn("border border-white/15 bg-white/8 text-[#eef5ed] shadow-none hover:bg-white/15 hover:shadow-none", !collapsed && "w-full justify-start gap-3 px-3.5")}>
            <Link href="/appointments" aria-label="Book an appointment" title={collapsed ? "Book an appointment" : undefined}>
              <Plus className="h-[18px] w-[18px]" aria-hidden />
              {!collapsed && "Book an appointment"}
            </Link>
          </Button>
        </div>
      )}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        {navGroups.map((group, groupIndex) => (
          <div key={group.title} className={cn(groupIndex > 0 && "mt-5")}>
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a0bab0]">{group.title}</p>}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(pathname, item.href, allHrefs);
                const badge = item.href === "/notifications" ? notificationCount : item.badge;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      aria-label={collapsed ? `${item.label}${badge ? `, ${badge} unread` : ""}` : undefined}
                      className={cn(
                        "relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#c7e7ce]",
                        isActive ? "bg-[#c7e7ce] font-semibold text-[#173c38]" : "text-[#d2e0d8] hover:bg-white/8 hover:text-white",
                        collapsed && "justify-center px-0"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.7} aria-hidden />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {badge != null && badge > 0 && (
                        <span className={cn("flex items-center justify-center rounded-full text-[10px] font-semibold", collapsed ? "absolute right-1.5 top-1.5 h-2 w-2 bg-[#c7e7ce]" : "h-5 min-w-5 bg-white/15 px-1.5", isActive && "bg-[#173c38]/10")}>
                          {!collapsed && (badge > 99 ? "99+" : badge)}
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

      {user && (
        <div className={cn("shrink-0 border-t border-white/10 p-4", collapsed && "px-3")}>
          <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "gap-2.5")}>
            <Link href={getProfilePath(user.role)} className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#c7e7ce]" aria-label="View profile">
              <UserAvatar name={user.name} avatarUrl={profile?.avatarUrl} className="h-10 w-10" fallbackClassName="bg-[#dbe8d4] text-[#173c38]" />
            </Link>
            {!collapsed && (
              <Link href={getProfilePath(user.role)} className="min-w-0 flex-1 rounded-lg outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#c7e7ce]">
                <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
                <p className="mt-0.5 truncate text-[11px] capitalize text-[#b6ccc1]">{user.role} account</p>
              </Link>
            )}
            <Button variant="ghost" size="icon" className="shrink-0 text-[#bdd2c8] hover:bg-white/10 hover:text-white" onClick={logout} aria-label="Sign out" title="Sign out">
              <LogOut className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
});
