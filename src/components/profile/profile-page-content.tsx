"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types";
import {
  patientProfileSchema,
  providerProfileSchema,
  adminProfileSchema,
  type PatientProfileInput,
  type ProviderProfileInput,
  type AdminProfileInput,
} from "@/lib/validators/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { ProfileAvatarUpload } from "./profile-avatar-upload";
import { ChangePasswordForm } from "./change-password-form";

type ProfileFormValues = PatientProfileInput | ProviderProfileInput | AdminProfileInput;
type ProfileTab = "personal" | "role" | "notifications" | "security";

function getSchema(role: UserRole) {
  switch (role) {
    case "provider":
      return providerProfileSchema;
    case "admin":
      return adminProfileSchema;
    default:
      return patientProfileSchema;
  }
}

function roleLabel(role: UserRole) {
  return role === "admin" ? "Administrator" : role === "provider" ? "Provider" : "Patient";
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[var(--color-status-critical)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-4">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p className="text-xs text-[var(--color-text-disabled)]">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function ProfilePageContent() {
  const { user, profile, updateProfile } = useAuth();
  const role = user?.role ?? "patient";
  const schema = getSchema(role);
  const [tab, setTab] = useState<ProfileTab>("personal");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          dateOfBirth: profile.dateOfBirth,
          address: profile.address,
          emailNotifications: profile.emailNotifications,
          smsNotifications: profile.smsNotifications,
          appointmentReminders: profile.appointmentReminders,
          labResultAlerts: profile.labResultAlerts,
          ...(role === "patient" && profile.patient
            ? {
                emergencyContactName: profile.patient.emergencyContactName,
                emergencyContactPhone: profile.patient.emergencyContactPhone,
                bloodType: profile.patient.bloodType ?? "",
                allergies: profile.patient.allergies ?? "",
                preferredPharmacy: profile.patient.preferredPharmacy ?? "",
              }
            : {}),
          ...(role === "provider" && profile.provider
            ? {
                specialty: profile.provider.specialty,
                licenseNumber: profile.provider.licenseNumber,
                department: profile.provider.department,
                bio: profile.provider.bio ?? "",
                acceptingNewPatients: profile.provider.acceptingNewPatients,
              }
            : {}),
          ...(role === "admin" && profile.admin
            ? {
                department: profile.admin.department,
                jobTitle: profile.admin.jobTitle,
              }
            : {}),
        }
      : undefined,
  });

  if (!user || !profile) return null;

  async function onSubmit(data: ProfileFormValues) {
    const base = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      emailNotifications: data.emailNotifications,
      smsNotifications: data.smsNotifications,
      appointmentReminders: data.appointmentReminders,
      labResultAlerts: data.labResultAlerts,
    };

    if (role === "patient") {
      const d = data as PatientProfileInput;
      await updateProfile({
        ...base,
        patient: {
          emergencyContactName: d.emergencyContactName,
          emergencyContactPhone: d.emergencyContactPhone,
          bloodType: d.bloodType ?? "",
          allergies: d.allergies ?? "",
          preferredPharmacy: d.preferredPharmacy ?? "",
        },
      });
    } else if (role === "provider") {
      const d = data as ProviderProfileInput;
      await updateProfile({
        ...base,
        provider: {
          specialty: d.specialty,
          licenseNumber: d.licenseNumber,
          department: d.department,
          bio: d.bio ?? "",
          acceptingNewPatients: d.acceptingNewPatients,
        },
      });
    } else {
      const d = data as AdminProfileInput;
      await updateProfile({
        ...base,
        admin: {
          department: d.department,
          jobTitle: d.jobTitle,
        },
      });
    }
    reset(data);
    toast.success("Profile saved", {
      description: "Your account details were updated successfully.",
    });
  }

  const err = errors as Record<string, { message?: string } | undefined>;
  const addressErr = errors.address as Record<string, { message?: string }> | undefined;

  return (
    <div className="space-y-6">
      <Card className="card-hover">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
          <ProfileAvatarUpload />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <Badge variant="secondary" className="capitalize">
                {roleLabel(role)}
              </Badge>
            </div>
            <div className="max-w-md space-y-1">
              <Label htmlFor="profile-email" className="flex items-center gap-1.5 text-xs text-[var(--color-text-disabled)]">
                <Mail className="h-3.5 w-3.5" />
                Email address
              </Label>
              <Input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                readOnly
                aria-describedby="email-readonly-hint"
              />
              <p id="email-readonly-hint" className="text-xs text-[var(--color-text-disabled)]">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <AnimatedTabs
          value={tab}
          onValueChange={setTab}
          layoutId="profile-section-tabs"
          ariaLabel="Profile sections"
          fit="hug"
          size="sm"
          options={[
            { value: "personal", label: "Personal" },
            {
              value: "role",
              label: role === "patient" ? "Health info" : role === "provider" ? "Practice" : "Work",
            },
            { value: "notifications", label: "Notifications" },
            { value: "security", label: "Security" },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {tab === "personal" && (
            <Card>
              <CardHeader>
                <CardTitle>Personal information</CardTitle>
                <CardDescription>Update your contact details and address.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="firstName" label="First name" error={err.firstName?.message}>
                  <Input id="firstName" {...register("firstName")} />
                </Field>
                <Field id="lastName" label="Last name" error={err.lastName?.message}>
                  <Input id="lastName" {...register("lastName")} />
                </Field>
                <Field id="phone" label="Phone" error={err.phone?.message}>
                  <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
                </Field>
                <Field id="dateOfBirth" label="Date of birth" error={err.dateOfBirth?.message}>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="street" label="Street address" error={addressErr?.street?.message}>
                    <Input id="street" autoComplete="street-address" {...register("address.street")} />
                  </Field>
                </div>
                <Field id="city" label="City" error={addressErr?.city?.message}>
                  <Input id="city" autoComplete="address-level2" {...register("address.city")} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field id="state" label="State" error={addressErr?.state?.message}>
                    <Input id="state" autoComplete="address-level1" maxLength={2} {...register("address.state")} />
                  </Field>
                  <Field id="zip" label="ZIP" error={addressErr?.zip?.message}>
                    <Input id="zip" autoComplete="postal-code" {...register("address.zip")} />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {tab === "role" && (
            <>
            {role === "patient" && (
              <Card>
                <CardHeader>
                  <CardTitle>Health information</CardTitle>
                  <CardDescription>Emergency contacts and medical preferences.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field id="emergencyContactName" label="Emergency contact" error={err.emergencyContactName?.message}>
                    <Input id="emergencyContactName" {...register("emergencyContactName" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="emergencyContactPhone" label="Emergency phone" error={err.emergencyContactPhone?.message}>
                    <Input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="bloodType" label="Blood type" error={err.bloodType?.message}>
                    <Input id="bloodType" placeholder="e.g. O+" {...register("bloodType" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="allergies" label="Allergies" error={err.allergies?.message}>
                    <Input id="allergies" placeholder="e.g. Penicillin" {...register("allergies" as keyof ProfileFormValues)} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="preferredPharmacy" label="Preferred pharmacy" error={err.preferredPharmacy?.message}>
                      <Input id="preferredPharmacy" {...register("preferredPharmacy" as keyof ProfileFormValues)} />
                    </Field>
                  </div>
                </CardContent>
              </Card>
            )}

            {role === "provider" && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice details</CardTitle>
                  <CardDescription>Your professional information visible to patients.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field id="specialty" label="Specialty" error={err.specialty?.message}>
                    <Input id="specialty" {...register("specialty" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="licenseNumber" label="License number" error={err.licenseNumber?.message}>
                    <Input id="licenseNumber" {...register("licenseNumber" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="department" label="Department" error={err.department?.message}>
                    <Input id="department" {...register("department" as keyof ProfileFormValues)} />
                  </Field>
                  <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-4 sm:col-span-2">
                    <div>
                      <Label htmlFor="acceptingNewPatients" className="text-sm font-medium">
                        Accepting new patients
                      </Label>
                      <p className="text-xs text-[var(--color-text-disabled)]">
                        Show your profile as open for new appointments
                      </p>
                    </div>
                    <Controller
                      name={"acceptingNewPatients" as keyof ProfileFormValues}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="acceptingNewPatients"
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="bio" label="Bio" error={err.bio?.message}>
                      <textarea
                        id="bio"
                        rows={4}
                        className="flex w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm shadow-[var(--shadow-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
                        {...register("bio" as keyof ProfileFormValues)}
                      />
                    </Field>
                  </div>
                </CardContent>
              </Card>
            )}

            {role === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Work information</CardTitle>
                  <CardDescription>Your role and department within the organization.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <Field id="jobTitle" label="Job title" error={err.jobTitle?.message}>
                    <Input id="jobTitle" {...register("jobTitle" as keyof ProfileFormValues)} />
                  </Field>
                  <Field id="department" label="Department" error={err.department?.message}>
                    <Input id="department" {...register("department" as keyof ProfileFormValues)} />
                  </Field>
                </CardContent>
              </Card>
            )}
            </>
          )}

          {tab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Controller
                  name="emailNotifications"
                  control={control}
                  render={({ field }) => (
                    <PreferenceRow
                      id="emailNotifications"
                      label="Email notifications"
                      description="Receive updates and alerts via email"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="smsNotifications"
                  control={control}
                  render={({ field }) => (
                    <PreferenceRow
                      id="smsNotifications"
                      label="SMS notifications"
                      description="Get text messages for urgent updates"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="appointmentReminders"
                  control={control}
                  render={({ field }) => (
                    <PreferenceRow
                      id="appointmentReminders"
                      label="Appointment reminders"
                      description="Reminders before upcoming visits"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="labResultAlerts"
                  control={control}
                  render={({ field }) => (
                    <PreferenceRow
                      id="labResultAlerts"
                      label="Lab result alerts"
                      description="Notify when new lab results are available"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </CardContent>
            </Card>
          )}

          {tab !== "security" && (
          <div className="sticky bottom-20 z-10 mt-6 flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 p-4 backdrop-blur lg:bottom-4">
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-disabled)]">
              <ShieldCheck className="h-4 w-4 text-[var(--color-brand-primary)]" />
              Your data is encrypted and HIPAA-protected
            </p>
            <Button type="submit" disabled={isSubmitting || !isDirty} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <HealthSpinner size={16} className="mr-2" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
          )}
        </form>

        {tab === "security" && <ChangePasswordForm />}
      </div>
    </div>
  );
}
