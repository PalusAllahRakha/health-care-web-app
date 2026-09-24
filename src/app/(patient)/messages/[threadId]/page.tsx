"use client";

import Link from "next/link";
import { use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Send } from "lucide-react";
import { sendMessageSchema, type SendMessageInput } from "@/lib/validators/message";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { MessageBubbles } from "@/components/messages/message-bubbles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/user-avatar";
import { toast } from "@/components/ui/toaster";
import { useMessages, useMessageThreads } from "@/lib/api/queries";

export default function MessageThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = use(params);
  const { data: messages, isLoading } = useMessages(threadId);
  const { data: threads } = useMessageThreads();
  const thread = threads?.find((t) => t.id === threadId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SendMessageInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { threadId, body: "" },
  });

  async function onSubmit(_data: SendMessageInput) {
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Message sent securely");
    reset({ threadId, body: "" });
  }

  return (
    <PageLayout className="flex min-h-[calc(100vh-12rem)] flex-col">
      <div className="flex items-center gap-4 border-b border-[var(--color-border-subtle)] pb-4">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/messages" aria-label="Back to messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        {thread && (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <UserAvatar name={thread.participantName} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[var(--color-text-primary)]">{thread.participantName}</p>
              <p className="text-sm text-[var(--color-brand-primary)]">{thread.participantRole}</p>
            </div>
          </div>
        )}
      </div>

      <Card className="card-hover mt-4 flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <SectionLoader label="Loading messages" sublabel="Fetching conversation" minHeight="min-h-[200px]" />
          ) : (
            <MessageBubbles messages={messages ?? []} />
          )}
        </div>

        <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40 p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <input type="hidden" {...register("threadId")} />
            <Textarea
              placeholder="Type your message…"
              className="min-h-11 max-h-32 flex-1 resize-none py-2.5"
              rows={1}
              {...register("body")}
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0 shadow-[var(--shadow-glow)]" disabled={isSubmitting} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </PageLayout>
  );
}
