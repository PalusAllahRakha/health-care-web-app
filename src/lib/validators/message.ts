import { z } from "zod";

export const sendMessageSchema = z.object({
  threadId: z.string().min(1, "Thread is required"),
  body: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less"),
});

export const newThreadSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or less"),
  body: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type NewThreadInput = z.infer<typeof newThreadSchema>;
