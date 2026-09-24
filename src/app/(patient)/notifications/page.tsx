"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { useNotifications } from "@/lib/api/queries";

export default function NotificationsPage() {
  const { data: items, isLoading } = useNotifications();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="Appointments, lab results, messages, and refill reminders in one place."
      />
      {isLoading ? (
        <SectionLoader label="Loading notifications" sublabel="Checking for updates" />
      ) : (
        <NotificationCenter notifications={items ?? []} mode="page" />
      )}
    </PageLayout>
  );
}
