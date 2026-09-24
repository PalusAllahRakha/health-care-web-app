import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2, "Use 2-letter state code"),
  zip: z.string().min(5, "ZIP code is required").max(10, "Invalid ZIP code"),
});

const baseProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s()+-]+$/, "Invalid phone number format"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: addressSchema,
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  labResultAlerts: z.boolean(),
});

export const patientProfileSchema = baseProfileSchema.extend({
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Enter a valid phone number"),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  preferredPharmacy: z.string().optional(),
});

export const providerProfileSchema = baseProfileSchema.extend({
  specialty: z.string().min(1, "Specialty is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  department: z.string().min(1, "Department is required"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  acceptingNewPatients: z.boolean(),
});

export const adminProfileSchema = baseProfileSchema.extend({
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PatientProfileInput = z.infer<typeof patientProfileSchema>;
export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;
export type AdminProfileInput = z.infer<typeof adminProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
