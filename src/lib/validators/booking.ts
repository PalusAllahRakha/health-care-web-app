import { z } from "zod";

export const bookingSchema = z.object({
  specialty: z.string().min(1, "Please select a specialty"),
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z
    .string()
    .min(1, "Please select a date")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z
    .string()
    .min(1, "Please select a time")
    .regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  visitType: z.enum(["in-person", "video"]),
  reason: z.string().max(500, "Reason must be under 500 characters").optional(),
});

export const specialtyStepSchema = bookingSchema.pick({ specialty: true });
export const doctorStepSchema = bookingSchema.pick({ specialty: true, doctorId: true });
export const datetimeStepSchema = bookingSchema.pick({
  specialty: true,
  doctorId: true,
  date: true,
  time: true,
});

export type BookingInput = z.infer<typeof bookingSchema>;
