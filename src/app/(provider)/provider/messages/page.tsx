"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerThreads } from "@/lib/provider-work";
import { formatRelative } from "@/lib/utils";

export default function ProviderMessagesPage() {
  const unread = providerThreads.reduce((sum, thread) => sum + thread.unread, 0);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Secure notes from your patients. Open a thread to reply."
      />
      <Card className="card-hover overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
          <CardTitle className="text-base">{unread} unread</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul>
            {providerThreads.map((thread) => (
              <li key={thread.id} className="border-b border-[var(--color-border-subtle)] last:border-0">
                <Link href={`/provider/messages/${thread.id}`} className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-[var(--color-surface-muted)]/50">
                  <div className="min-w-0">
                    <p className="font-semibold">{thread.patientName}</p>
                    <p className="text-xs text-[var(--color-brand-primary)]">{thread.topic}</p>
                    <p className="mt-1 truncate text-sm text-[var(--color-text-secondary)]">{thread.preview}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-xs text-[var(--color-text-disabled)]">{formatRelative(thread.sentAt)}</span>
                    {thread.unread > 0 && <Badge>{thread.unread}</Badge>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
