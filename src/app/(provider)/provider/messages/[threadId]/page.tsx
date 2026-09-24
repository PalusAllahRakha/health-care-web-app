"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { PageLayout } from "@/components/shared/page-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { providerThreads } from "@/lib/provider-work";

export default function ProviderThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = use(params);
  const thread = providerThreads.find((item) => item.id === threadId);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    setSent((current) => [...current, body]);
    setDraft("");
    toast.success("Reply sent securely");
  }

  return (
    <PageLayout className="flex min-h-[calc(100vh-12rem)] flex-col">
      <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-4">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/provider/messages" aria-label="Back to messages"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <p className="font-semibold">{thread?.patientName ?? "Patient"}</p>
          <p className="text-sm text-[var(--color-brand-primary)]">{thread?.topic ?? "Message"}</p>
        </div>
      </div>

      <Card className="mt-4 flex flex-1 flex-col gap-4 p-4 sm:p-6">
        {thread && (
          <div className="max-w-xl rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3 text-sm">
            <p className="text-xs text-[var(--color-text-secondary)]">{thread.patientName}</p>
            <p className="mt-1">{thread.preview}</p>
          </div>
        )}
        {sent.map((body) => (
          <div key={body} className="ml-auto max-w-xl rounded-2xl bg-[var(--color-brand-primary)] px-4 py-3 text-sm text-[var(--color-brand-on-primary)]">
            {body}
          </div>
        ))}
        <form
          className="mt-auto flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a reply" className="min-h-11" />
          <Button type="submit" size="icon" aria-label="Send reply" disabled={!draft.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </PageLayout>
  );
}
