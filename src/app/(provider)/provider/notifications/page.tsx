"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { providerNotifications } from "@/lib/provider-work";

export default function ProviderNotificationsPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Check-ins, critical labs, refill requests, and patient messages."
      />
      <NotificationCenter notifications={providerNotifications} mode="page" />
    </PageLayout>
  );
}
