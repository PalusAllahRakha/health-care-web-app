import type { UserRole } from "@/types";

export type SignupRole = Extract<UserRole, "patient" | "provider">;

export interface RegisteredAccount {
  id: string;
  email: string;
  password: string;
  role: SignupRole;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  specialty?: string;
  licenseNumber?: string;
}

const STORAGE_KEY = "hp-registered-accounts";

export function loadRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RegisteredAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegisteredAccount(account: RegisteredAccount) {
  const existing = loadRegisteredAccounts().filter(
    (entry) => entry.email.toLowerCase() !== account.email.toLowerCase()
  );
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, account]));
}

export function findRegisteredAccount(
  email: string,
  role?: SignupRole
): RegisteredAccount | undefined {
  const normalized = email.trim().toLowerCase();
  return loadRegisteredAccounts().find((entry) => {
    const emailMatch = entry.email.toLowerCase() === normalized;
    return role ? emailMatch && entry.role === role : emailMatch;
  });
}

export function isDemoEmail(email: string) {
  return email.trim().toLowerCase() === "sarah.chen@email.com";
}
