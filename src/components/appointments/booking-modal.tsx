"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  MapPin,
  Stethoscope,
  Video,
} from "lucide-react";
import {
  bookingSchema,
  specialtyStepSchema,
  doctorStepSchema,
  datetimeStepSchema,
  type BookingInput,
} from "@/lib/validators/booking";
import { useBookingStore } from "@/stores/booking-store";
import { doctors, getDoctorById } from "@/lib/mock-data";
import { getAvailableSlots, VISIT_TYPES } from "@/lib/booking-availability";
import { fadeUp, getTransition } from "@/lib/motion";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { BookingStep } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookingStepIndicator } from "@/components/appointments/booking-step-indicator";
import { BookingSpecialtyGrid } from "@/components/appointments/booking-specialty-grid";
import { BookingDoctorCard } from "@/components/appointments/booking-doctor-card";
import { BookingDatetimeStep } from "@/components/appointments/booking-datetime-step";

const STEP_TITLES: Record<BookingStep, string> = {
  specialty: "Choose a specialty",
  doctor: "Select your doctor",
  datetime: "Pick date & time",
  confirm: "Review & confirm",
};

const STEP_DESCRIPTIONS: Record<BookingStep, string> = {
  specialty: "What type of care do you need today?",
  doctor: "Compare providers and pick who fits best.",
  datetime: "Choose a convenient weekday and time slot.",
  confirm: "Double-check the details before booking.",
};

export interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: BookingInput) => void;
  specialty?: string;
  selectedDate?: string;
  selectedTime?: string;
  onSelectTime?: (time: string) => void;
  onConfirm?: () => void;
}

export function BookingModal({
  open,
  onOpenChange,
  onComplete,
  specialty: specialtyProp,
  selectedDate: selectedDateProp,
  selectedTime: selectedTimeProp,
  onSelectTime,
  onConfirm,
}: BookingModalProps) {
  const reduced = useReducedMotion() ?? false;

  const {
    step,
    specialty,
    doctorId,
    date,
    time,
    visitType,
    reason,
    setSpecialty,
    setDoctorId,
    setDate,
    setTime,
    setVisitType,
    setReason,
    nextStep,
    prevStep,
    reset,
  } = useBookingStore();

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { specialty, doctorId, date, time, visitType, reason },
    mode: "onChange",
  });

  useEffect(() => {
    if (specialtyProp && specialtyProp !== "all") setSpecialty(specialtyProp);
  }, [specialtyProp, setSpecialty]);

  useEffect(() => {
    if (selectedDateProp) setDate(selectedDateProp);
  }, [selectedDateProp, setDate]);

  useEffect(() => {
    if (selectedTimeProp) setTime(selectedTimeProp);
  }, [selectedTimeProp, setTime]);

  useEffect(() => {
    form.reset({ specialty, doctorId, date, time, visitType, reason });
  }, [specialty, doctorId, date, time, visitType, reason, form]);

  const filteredDoctors = useMemo(
    () => (specialty ? doctors.filter((d) => d.specialty === specialty) : doctors),
    [specialty]
  );

  const selectedDoctor = useMemo(
    () => (doctorId ? getDoctorById(doctorId) : undefined),
    [doctorId]
  );

  const canContinue = useMemo(() => {
    const values = { specialty, doctorId, date, time, visitType, reason };
    const schemas = {
      specialty: specialtyStepSchema,
      doctor: doctorStepSchema,
      datetime: datetimeStepSchema,
      confirm: bookingSchema,
    };
    return schemas[step].safeParse(values).success;
  }, [step, specialty, doctorId, date, time, visitType, reason]);

  const validateCurrentStep = useCallback(() => {
    const values = { specialty, doctorId, date, time, visitType, reason };
    const schemas = {
      specialty: specialtyStepSchema,
      doctor: doctorStepSchema,
      datetime: datetimeStepSchema,
      confirm: bookingSchema,
    };
    const result = schemas[step].safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BookingInput;
        if (field) form.setError(field, { message: issue.message });
      });
      return false;
    }
    return true;
  }, [step, specialty, doctorId, date, time, visitType, reason, form]);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    },
    [onOpenChange, reset]
  );

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;

    if (step === "confirm") {
      const data = form.getValues();
      onComplete?.(data);
      onConfirm?.();
      handleClose(false);
      return;
    }
    form.clearErrors();
    nextStep();
  }, [validateCurrentStep, step, form, onComplete, onConfirm, nextStep, handleClose]);

  const handleSpecialtyChange = useCallback(
    (value: string) => {
      setSpecialty(value);
      form.setValue("specialty", value, { shouldValidate: true });
    },
    [setSpecialty, form]
  );

  const handleDoctorSelect = useCallback(
    (id: string) => {
      setDoctorId(id);
      form.setValue("doctorId", id, { shouldValidate: true });
    },
    [setDoctorId, form]
  );

  const handleDateSelect = useCallback(
    (selectedDate: string) => {
      setDate(selectedDate);
      form.setValue("date", selectedDate, { shouldValidate: true });
      const slots = doctorId ? getAvailableSlots(doctorId, selectedDate) : [];
      if (time && !slots.includes(time)) {
        setTime("");
        form.setValue("time", "", { shouldValidate: true });
      }
    },
    [setDate, setTime, doctorId, time, form]
  );

  const handleTimeSelect = useCallback(
    (selectedTime: string) => {
      setTime(selectedTime);
      form.setValue("time", selectedTime, { shouldValidate: true });
      onSelectTime?.(selectedTime);
    },
    [setTime, form, onSelectTime]
  );


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex w-full max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[var(--color-border-subtle)] px-6 pb-4 pt-6">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle>{STEP_TITLES[step]}</DialogTitle>
                <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <BookingStepIndicator current={step} />
              </div>
            </div>

            <div className="h-[min(58vh,520px)] min-h-[320px] overflow-y-auto px-6 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={getTransition(reduced)}
                >
                  {step === "specialty" && (
                    <div className="space-y-3">
                      <BookingSpecialtyGrid selected={specialty} onChange={handleSpecialtyChange} />
                      {form.formState.errors.specialty && (
                        <p className="text-sm text-[var(--color-status-critical)]">
                          {form.formState.errors.specialty.message}
                        </p>
                      )}
                    </div>
                  )}

                  {step === "doctor" && (
                    <div className="space-y-3">
                      {filteredDoctors.map((doctor) => (
                        <BookingDoctorCard
                          key={doctor.id}
                          doctor={doctor}
                          selected={doctorId === doctor.id}
                          onSelect={handleDoctorSelect}
                        />
                      ))}
                      {form.formState.errors.doctorId && (
                        <p className="text-sm text-[var(--color-status-critical)]">
                          {form.formState.errors.doctorId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {step === "datetime" && (
                    <div className="space-y-3">
                      <BookingDatetimeStep
                        doctor={selectedDoctor}
                        date={date}
                        time={time}
                        onDateSelect={handleDateSelect}
                        onTimeSelect={handleTimeSelect}
                      />
                      {(form.formState.errors.date || form.formState.errors.time) && (
                        <p className="text-sm text-[var(--color-status-critical)]">
                          {form.formState.errors.date?.message ?? form.formState.errors.time?.message}
                        </p>
                      )}
                    </div>
                  )}

                  {step === "confirm" && selectedDoctor && (
                    <div className="space-y-4">
                      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-sm font-bold text-white">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-2 text-sm">
                            <div className="flex justify-between gap-2">
                              <span className="text-[var(--color-text-secondary)]">Doctor</span>
                              <span className="text-right font-medium">{selectedDoctor.name}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[var(--color-text-secondary)]">Specialty</span>
                              <span className="font-medium">{selectedDoctor.specialty}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[var(--color-text-secondary)]">Date</span>
                              <span className="font-medium">{date ? formatDate(date) : "—"}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-[var(--color-text-secondary)]">Time</span>
                              <span className="font-medium">{time ? formatTime(time) : "—"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Visit type</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {VISIT_TYPES.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setVisitType(type.value);
                                form.setValue("visitType", type.value, { shouldValidate: true });
                              }}
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors",
                                visitType === type.value
                                  ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10"
                                  : "border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-muted)]"
                              )}
                            >
                              {type.value === "video" ? (
                                <Video className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                              ) : (
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                              )}
                              <div>
                                <p className="text-sm font-medium">{type.label}</p>
                                <p className="text-xs text-[var(--color-text-disabled)]">{type.location}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for visit (optional)</Label>
                        <textarea
                          id="reason"
                          rows={3}
                          placeholder="Briefly describe your symptoms or reason for the visit…"
                          value={reason}
                          onChange={(e) => {
                            setReason(e.target.value);
                            form.setValue("reason", e.target.value);
                          }}
                          className="flex w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm shadow-[var(--shadow-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
                        />
                      </div>

                      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-3 text-xs text-[var(--color-text-secondary)]">
                        <CalendarCheck className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                        Estimated copay: $25 · Free cancellation up to 24 hours before
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <DialogFooter className="shrink-0 border-t border-[var(--color-border-subtle)] px-6 py-4">
              {step !== "specialty" && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button type="button" onClick={handleNext} disabled={!canContinue} className="min-w-[120px]">
                {step === "confirm" ? "Confirm booking" : "Continue"}
              </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
