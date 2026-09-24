"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { newThreadSchema, type NewThreadInput } from "@/lib/validators/message";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionLoader } from "@/components/shared/section-loader";
import { ThreadList } from "@/components/messages/thread-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { useMessageThreads } from "@/lib/api/queries";

export default function MessagesPage() {
  const { data: threads, isLoading } = useMessageThreads();
  const [composing, setComposing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewThreadInput>({
    resolver: zodResolver(newThreadSchema),
    defaultValues: { recipientId: "doc-007", subject: "", body: "" },
  });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Message sent", {
      description: "Your care team will reply in this secure thread.",
    });
    setComposing(false);
    reset();
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Secure messaging"
        title="Messages"
        description="HIPAA-protected conversations with your care team."
      >
        <Button onClick={() => setComposing(!composing)}>
          {composing ? "Cancel" : "Compose"}
        </Button>
      </PageHeader>

      {composing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && <p className="text-sm text-[var(--color-status-critical)]">{errors.subject.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea id="body" {...register("body")} />
                {errors.body && <p className="text-sm text-[var(--color-status-critical)]">{errors.body.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting}>Send message</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <SectionLoader label="Loading messages" sublabel="Fetching your conversations" />
      ) : threads && threads.length > 0 ? (
        <ThreadList threads={threads} />
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Start a conversation with your provider about appointments, results, or care questions."
          actionLabel="Compose message"
          onAction={() => setComposing(true)}
        />
      )}
    </PageLayout>
  );
}
