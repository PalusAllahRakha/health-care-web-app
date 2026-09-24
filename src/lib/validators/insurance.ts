import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const insuranceUploadSchema = z.object({
  planName: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be 100 characters or less"),
  memberId: z
    .string()
    .min(1, "Member ID is required")
    .max(50, "Member ID must be 50 characters or less"),
  groupNumber: z
    .string()
    .min(1, "Group number is required")
    .max(50, "Group number must be 50 characters or less"),
  cardFront: z
    .instanceof(File, { message: "Front of insurance card is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "File must be 5MB or less")
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type),
      "File must be JPEG, PNG, or PDF"
    ),
  cardBack: z
    .instanceof(File, { message: "Back of insurance card is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "File must be 5MB or less")
    .refine(
      (file) => ACCEPTED_TYPES.includes(file.type),
      "File must be JPEG, PNG, or PDF"
    ),
});

export const insuranceUpdateSchema = insuranceUploadSchema.omit({
  cardFront: true,
  cardBack: true,
});

export type InsuranceUploadInput = z.infer<typeof insuranceUploadSchema>;
export type InsuranceUpdateInput = z.infer<typeof insuranceUpdateSchema>;
