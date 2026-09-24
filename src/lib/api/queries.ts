"use client";

import { useQuery } from "@tanstack/react-query";
import {
  appointments,
  doctors,
  getMessagesByThread,
  insurancePlan,
  labResults,
  messageThreads,
  notifications,
  patients,
  prescriptions,
  systemMetrics,
} from "@/lib/mock-data";
import type { Appointment, LabResult } from "@/types";
import { mockFetch } from "./mock";

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => mockFetch(appointments, 600),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const data = await mockFetch(appointments, 400);
      const apt = data.find((a) => a.id === id);
      if (!apt) throw new Error("Appointment not found");
      return apt;
    },
    enabled: !!id,
  });
}

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: ["appointments", "upcoming"],
    queryFn: async () => {
      const data = await mockFetch(appointments, 500);
      return data
        .filter((a) => a.status === "upcoming")
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
    },
  });
}

export function useLabResults() {
  return useQuery({
    queryKey: ["lab-results"],
    queryFn: () => mockFetch(labResults, 550),
  });
}

export function useLabResult(id: string) {
  return useQuery({
    queryKey: ["lab-result", id],
    queryFn: async () => {
      const data = await mockFetch(labResults, 450);
      const result = data.find((r) => r.id === id);
      if (!result) throw new Error("Lab result not found");
      return result;
    },
    enabled: !!id,
  });
}

export function usePrescriptions() {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => mockFetch(prescriptions, 500),
  });
}

export function useDoctors(specialty?: string) {
  return useQuery({
    queryKey: ["doctors", specialty ?? "all"],
    queryFn: async () => {
      const data = await mockFetch(doctors, 500);
      if (!specialty || specialty === "all") return data;
      return data.filter((d) => d.specialty === specialty);
    },
  });
}

export function useMessageThreads() {
  return useQuery({
    queryKey: ["message-threads"],
    queryFn: () => mockFetch(messageThreads, 450),
  });
}

export function useMessages(threadId: string) {
  return useQuery({
    queryKey: ["messages", threadId],
    queryFn: async () => {
      await mockFetch(null, 400);
      return getMessagesByThread(threadId);
    },
    enabled: !!threadId,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => mockFetch(notifications, 400),
  });
}

export function useInsurance() {
  return useQuery({
    queryKey: ["insurance"],
    queryFn: () => mockFetch(insurancePlan, 400),
  });
}

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => mockFetch(patients, 600),
  });
}

export function useSystemMetrics() {
  return useQuery({
    queryKey: ["system-metrics"],
    queryFn: () => mockFetch(systemMetrics, 500),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      await mockFetch(null, 550);
      const upcoming = appointments.filter((a) => a.status === "upcoming").length;
      const criticalLabs = labResults.filter((r) => r.flag === "critical").length;
      const refillsDue = prescriptions.filter((r) => r.refillsRemaining <= 1).length;
      const unreadMessages = messageThreads.reduce((sum, t) => sum + t.unread, 0);
      return { upcoming, criticalLabs, refillsDue, unreadMessages };
    },
  });
}

export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

export function getFlagVariant(flag: LabResult["flag"]) {
  switch (flag) {
    case "critical":
      return "destructive" as const;
    case "borderline":
      return "warning" as const;
    default:
      return "success" as const;
  }
}

export function formatAppointmentDate(apt: Appointment) {
  return new Date(`${apt.date}T${apt.time}`).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
