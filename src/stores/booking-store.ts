import { create } from "zustand";
import type { BookingStep } from "@/types";
import type { VisitType } from "@/lib/booking-availability";

interface BookingState {
  step: BookingStep;
  specialty: string;
  doctorId: string;
  date: string;
  time: string;
  visitType: VisitType;
  reason: string;
  setStep: (step: BookingStep) => void;
  setSpecialty: (specialty: string) => void;
  setDoctorId: (doctorId: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setVisitType: (visitType: VisitType) => void;
  setReason: (reason: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const STEPS: BookingStep[] = ["specialty", "doctor", "datetime", "confirm"];

const initialState = {
  step: "specialty" as BookingStep,
  specialty: "",
  doctorId: "",
  date: "",
  time: "",
  visitType: "in-person" as VisitType,
  reason: "",
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setSpecialty: (specialty) => set({ specialty, doctorId: "" }),

  setDoctorId: (doctorId) => set({ doctorId, date: "", time: "" }),

  setDate: (date) => set({ date, time: "" }),

  setTime: (time) => set({ time }),

  setVisitType: (visitType) => set({ visitType }),

  setReason: (reason) => set({ reason }),

  nextStep: () => {
    const { step } = get();
    const index = STEPS.indexOf(step);
    if (index < STEPS.length - 1) {
      set({ step: STEPS[index + 1] });
    }
  },

  prevStep: () => {
    const { step } = get();
    const index = STEPS.indexOf(step);
    if (index > 0) {
      set({ step: STEPS[index - 1] });
    }
  },

  reset: () => set(initialState),
}));
