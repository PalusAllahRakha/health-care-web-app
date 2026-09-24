"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  patientSignupSchema,
  providerSignupSchema,
  PROVIDER_SIGNUP_SPECIALTIES,
  type PatientSignupInput,
  type ProviderSignupInput,
} from "@/lib/validators/auth";
import type { SignupRole } from "@/lib/auth/registered-accounts";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PatientSignupFormProps {
  onSubmit: (data: PatientSignupInput) => Promise<void>;
  error: string | null;
}

interface ProviderSignupFormProps {
  onSubmit: (data: ProviderSignupInput) => Promise<void>;
  error: string | null;
}

const formShellClass =
  "flex h-full min-h-0 min-w-0 flex-col";
const fieldsScrollClass =
  "min-h-0 flex-1 space-y-3.5 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] pr-1 sm:space-y-4";
const formFooterClass =
  "shrink-0 space-y-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] pt-3.5 sm:pt-4";

export function PatientSignupForm({ onSubmit, error }: PatientSignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientSignupInput>({
    resolver: zodResolver(patientSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formShellClass} noValidate>
      <div className={fieldsScrollClass}>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 sm:gap-4">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="patient-firstName">First name</Label>
            <Input
              id="patient-firstName"
              className="h-11 w-full sm:h-12"
              autoComplete="given-name"
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <Label htmlFor="patient-lastName">Last name</Label>
            <Input
              id="patient-lastName"
              className="h-11 w-full sm:h-12"
              autoComplete="family-name"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor="patient-email">Email address</Label>
          <Input
            id="patient-email"
            type="email"
            className="h-11 w-full sm:h-12"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-[var(--color-status-critical)]" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 sm:gap-4">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="patient-phone">Phone</Label>
            <Input
              id="patient-phone"
              type="tel"
              className="h-11 w-full sm:h-12"
              autoComplete="tel"
              placeholder="(555) 000-0000"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <Label htmlFor="patient-dob">Date of birth</Label>
            <Input
              id="patient-dob"
              type="date"
              className="h-11 w-full min-w-0 sm:h-12"
              {...register("dateOfBirth")}
              aria-invalid={!!errors.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
        </div>
        <AuthPasswordField
          id="patient-password"
          label="Password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <AuthPasswordField
          id="patient-confirmPassword"
          label="Confirm password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className={formFooterClass}>
        {error && (
          <p
            className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button type="submit" className="h-11 w-full sm:h-12" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <HealthSpinner size={16} /> Creating account…
            </>
          ) : (
            <>
              Create patient account <ArrowRight className="size-4 shrink-0" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function ProviderSignupForm({ onSubmit, error }: ProviderSignupFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderSignupInput>({
    resolver: zodResolver(providerSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      licenseNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formShellClass} noValidate>
      <div className={fieldsScrollClass}>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 sm:gap-4">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="provider-firstName">First name</Label>
            <Input
              id="provider-firstName"
              className="h-11 w-full sm:h-12"
              autoComplete="given-name"
              {...register("firstName")}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <Label htmlFor="provider-lastName">Last name</Label>
            <Input
              id="provider-lastName"
              className="h-11 w-full sm:h-12"
              autoComplete="family-name"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor="provider-email">Work email</Label>
          <Input
            id="provider-email"
            type="email"
            className="h-11 w-full sm:h-12"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-[var(--color-status-critical)]" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor="provider-phone">Phone</Label>
          <Input
            id="provider-phone"
            type="tel"
            className="h-11 w-full sm:h-12"
            autoComplete="tel"
            placeholder="(555) 000-0000"
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-[var(--color-status-critical)]" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2 sm:gap-4">
          <div className="min-w-0 space-y-2">
            <Label htmlFor="provider-specialty">Specialty</Label>
            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="provider-specialty"
                    className="h-11 w-full min-w-0 sm:h-12"
                    aria-invalid={!!errors.specialty}
                  >
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_SIGNUP_SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.specialty && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.specialty.message}
              </p>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <Label htmlFor="provider-license">License number</Label>
            <Input
              id="provider-license"
              className="h-11 w-full sm:h-12"
              placeholder="OR-MD-00000"
              {...register("licenseNumber")}
              aria-invalid={!!errors.licenseNumber}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>
        </div>
        <AuthPasswordField
          id="provider-password"
          label="Password"
          registration={register("password")}
          error={errors.password?.message}
        />
        <AuthPasswordField
          id="provider-confirmPassword"
          label="Confirm password"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className={formFooterClass}>
        {error && (
          <p
            className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button type="submit" className="h-11 w-full sm:h-12" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <HealthSpinner size={16} /> Submitting…
            </>
          ) : (
            <>
              <span className="sm:hidden">Submit for approval</span>
              <span className="hidden sm:inline">Submit for admin approval</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function SignupFormByRole({
  role,
  onPatientSubmit,
  onProviderSubmit,
  error,
}: {
  role: SignupRole;
  onPatientSubmit: (data: PatientSignupInput) => Promise<void>;
  onProviderSubmit: (data: ProviderSignupInput) => Promise<void>;
  error: string | null;
}) {
  return (
    <div className="grid min-h-0 min-w-0 flex-1 grid-rows-1 overflow-hidden">
      <div
        className={cn(
          "col-start-1 row-start-1 min-h-0 min-w-0",
          role !== "patient" && "invisible pointer-events-none"
        )}
        aria-hidden={role !== "patient"}
      >
        <PatientSignupForm onSubmit={onPatientSubmit} error={role === "patient" ? error : null} />
      </div>
      <div
        className={cn(
          "col-start-1 row-start-1 min-h-0 min-w-0",
          role !== "provider" && "invisible pointer-events-none"
        )}
        aria-hidden={role !== "provider"}
      >
        <ProviderSignupForm onSubmit={onProviderSubmit} error={role === "provider" ? error : null} />
      </div>
    </div>
  );
}
