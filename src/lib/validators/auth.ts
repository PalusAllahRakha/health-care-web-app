import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const mfaSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});

const passwordField = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

const baseSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(60, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Enter a valid phone number"),
  password: passwordField,
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

export const patientSignupSchema = baseSignupSchema
  .extend({
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const providerSignupSchema = baseSignupSchema
  .extend({
    specialty: z.string().min(1, "Specialty is required"),
    licenseNumber: z
      .string()
      .min(1, "License number is required")
      .min(4, "Enter a valid license number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const PROVIDER_SIGNUP_SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Internal Medicine",
  "Ophthalmology",
  "ENT",
  "Gastroenterology",
  "Oncology",
  "Endocrinology",
] as const;

export type LoginInput = z.infer<typeof loginSchema>;
export type MfaInput = z.infer<typeof mfaSchema>;
export type PatientSignupInput = z.infer<typeof patientSignupSchema>;
export type ProviderSignupInput = z.infer<typeof providerSignupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
