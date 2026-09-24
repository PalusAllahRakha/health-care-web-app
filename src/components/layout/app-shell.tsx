"use client";

import { memo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ConsentBanner } from "@/components/shared/consent-banner";
import { PageContainer } from "@/components/shared/page-container";
import { SessionTimeout } from "@/components/shared/session-timeout";
import { useAuth } from "@/providers/auth-provider";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export interface AppShellProps {
  children: ReactNode;
  className?: string;
  notificationCount?: number;
  showConsentBanner?: boolean;
  enableSessionTimeout?: boolean;
}

export const AppShell = memo(function AppShell({
  children,
  className,
  notificationCount,
  showConsentBanner = true,
  enableSessionTimeout = true,
}: AppShellProps) {
  const { logout } = useAuth();

  return (
    <div className="app-canvas flex min-h-screen">
      <Sidebar notificationCount={notificationCount} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar notificationCount={notificationCount} />

        <main
          id="main-content"
          className={cn(
            "flex-1 px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:py-8 lg:pb-10 xl:px-10",
            className
          )}
          tabIndex={-1}
        >
          <PageContainer>{children}</PageContainer>
        </main>

        <MobileBottomNav notificationCount={notificationCount} />
      </div>

      {showConsentBanner && <ConsentBanner />}
      {enableSessionTimeout && <SessionTimeout onTimeout={logout} />}
    </div>
  );
});
