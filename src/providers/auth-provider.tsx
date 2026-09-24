"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, UserProfile, UserRole } from "@/types";
import { DEMO_USER, PROVIDER_USER, ADMIN_USER, getDefaultProfile } from "@/lib/mock-data";
import {
  findRegisteredAccount,
  isDemoEmail,
  saveRegisteredAccount,
  type RegisteredAccount,
  type SignupRole,
} from "@/lib/auth/registered-accounts";
import type { PatientSignupInput, ProviderSignupInput } from "@/lib/validators/auth";
import { upsertProvider } from "@/lib/auth/provider-approvals";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  mfaVerified: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean }>;
  signup: (
    role: SignupRole,
    data: PatientSignupInput | ProviderSignupInput
  ) => Promise<void>;
  requestPasswordReset: (role: SignupRole, email: string) => Promise<void>;
  verifyMfa: (code: string) => Promise<boolean>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

interface AuthSession {
  user: User | null;
  profile: UserProfile | null;
  mfaVerified: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const MFA_CODE = "123456";
const DEMO_PASSWORD = "password";

function loadProfile(userId: string): UserProfile | null {
  const stored = sessionStorage.getItem(`hp-profile-${userId}`);
  if (stored) {
    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      /* fall through */
    }
  }
  return getDefaultProfile(userId);
}

function saveProfile(profile: UserProfile) {
  sessionStorage.setItem(`hp-profile-${profile.userId}`, JSON.stringify(profile));
}

function syncUserName(user: User, profile: UserProfile): User {
  return { ...user, name: `${profile.firstName} ${profile.lastName}`.trim() };
}

function readStoredSession(): AuthSession {
  const empty: AuthSession = { user: null, profile: null, mfaVerified: false };
  if (typeof window === "undefined") return empty;

  const raw = sessionStorage.getItem("hp-auth");
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw) as { user: User; mfaVerified: boolean };
    const profile = loadProfile(parsed.user.id);
    const user = profile ? syncUserName(parsed.user, profile) : parsed.user;
    return { user, profile, mfaVerified: parsed.mfaVerified };
  } catch {
    return empty;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    profile: null,
    mfaVerified: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Defer so session restore is not a sync setState in the effect body.
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setSession(readStoredSession());
      setIsLoading(false);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const { user, profile, mfaVerified } = session;

  const persist = useCallback((u: User | null, mfa: boolean) => {
    if (u) {
      sessionStorage.setItem("hp-auth", JSON.stringify({ user: u, mfaVerified: mfa }));
    } else {
      sessionStorage.removeItem("hp-auth");
    }
  }, []);

  const beginSession = useCallback(
    (nextUser: User, nextProfile: UserProfile | null) => {
      const synced = nextProfile ? syncUserName(nextUser, nextProfile) : nextUser;
      setSession({ user: synced, profile: nextProfile, mfaVerified: false });
      persist(synced, false);
    },
    [persist]
  );

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    if (email === "sarah.chen@email.com" && password === "password") {
      const p = loadProfile(DEMO_USER.id);
      beginSession(DEMO_USER, p);
      setIsLoading(false);
      return { mfaRequired: true };
    }

    const registered = findRegisteredAccount(email);
    if (registered && registered.password === password) {
      const nextUser: User = {
        id: registered.id,
        name: `${registered.firstName} ${registered.lastName}`.trim(),
        email: registered.email,
        role: registered.role,
      };
      let profile = loadProfile(registered.id);
      if (!profile) {
        profile = {
          ...getDefaultProfile(registered.role === "provider" ? PROVIDER_USER.id : DEMO_USER.id)!,
          userId: registered.id,
          firstName: registered.firstName,
          lastName: registered.lastName,
          phone: registered.phone,
          dateOfBirth: registered.dateOfBirth ?? "",
          patient:
            registered.role === "patient"
              ? getDefaultProfile(DEMO_USER.id)?.patient
              : undefined,
          provider:
            registered.role === "provider"
              ? {
                  specialty: registered.specialty ?? "",
                  licenseNumber: registered.licenseNumber ?? "",
                  department: "General",
                  bio: "",
                  acceptingNewPatients: true,
                }
              : undefined,
          admin: undefined,
        };
        saveProfile(profile);
      }
      beginSession(nextUser, profile);
      setIsLoading(false);
      return { mfaRequired: true };
    }

    setIsLoading(false);
    throw new Error("Invalid credentials");
  }, [beginSession]);

  const signup = useCallback(
    async (role: SignupRole, data: PatientSignupInput | ProviderSignupInput) => {
      await new Promise((r) => setTimeout(r, 500));
      const email = data.email.trim().toLowerCase();

      if (isDemoEmail(email) || findRegisteredAccount(email)) {
        throw new Error("An account with this email already exists");
      }

      const account: RegisteredAccount = {
        id: `user-${role}-${Date.now()}`,
        email,
        password: data.password,
        role,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        dateOfBirth: "dateOfBirth" in data ? data.dateOfBirth : undefined,
        specialty: "specialty" in data ? data.specialty : undefined,
        licenseNumber: "licenseNumber" in data ? data.licenseNumber : undefined,
      };

      saveRegisteredAccount(account);

      if (role === "provider" && "specialty" in data) {
        upsertProvider({
          id: account.id,
          name: `Dr. ${account.firstName} ${account.lastName}`.trim(),
          email: account.email,
          specialty: account.specialty ?? "",
          licenseNumber: account.licenseNumber ?? "",
          phone: account.phone,
          submittedAt: new Date().toISOString(),
          status: "pending",
        });
      }

      const nextUser: User = {
        id: account.id,
        name: `${account.firstName} ${account.lastName}`.trim(),
        email: account.email,
        role: account.role,
      };

      const baseProfile = getDefaultProfile(
        role === "provider" ? PROVIDER_USER.id : DEMO_USER.id
      );
      const profile: UserProfile = {
        ...(baseProfile ?? {
          userId: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          phone: account.phone,
          dateOfBirth: account.dateOfBirth ?? "",
          address: { street: "", city: "", state: "", zip: "" },
          emailNotifications: true,
          smsNotifications: false,
          appointmentReminders: true,
          labResultAlerts: true,
        }),
        userId: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
        dateOfBirth: account.dateOfBirth ?? baseProfile?.dateOfBirth ?? "",
        patient:
          role === "patient"
            ? {
                emergencyContactName: "",
                emergencyContactPhone: "",
                bloodType: "",
                allergies: "",
                preferredPharmacy: "",
              }
            : undefined,
        provider:
          role === "provider"
            ? {
                specialty: account.specialty ?? "",
                licenseNumber: account.licenseNumber ?? "",
                department: "General",
                bio: "",
                acceptingNewPatients: true,
              }
            : undefined,
        admin: undefined,
      };
      saveProfile(profile);
      beginSession(nextUser, profile);
    },
    [beginSession]
  );

  const requestPasswordReset = useCallback(async (role: SignupRole, email: string) => {
    await new Promise((r) => setTimeout(r, 450));
    const normalized = email.trim().toLowerCase();
    const knownDemo =
      (role === "patient" && isDemoEmail(normalized)) ||
      (role === "provider" && normalized === "j.wilson@healthcare.org");
    const registered = findRegisteredAccount(normalized, role);

    if (!knownDemo && !registered) {
      throw new Error("No account found for this email and role");
    }
  }, []);

  const verifyMfa = useCallback(async (code: string) => {
    await new Promise((r) => setTimeout(r, 300));
    if (code === MFA_CODE && user) {
      setSession((prev) => ({ ...prev, mfaVerified: true }));
      persist(user, true);
      return true;
    }
    return false;
  }, [user, persist]);

  const logout = useCallback(() => {
    setSession({ user: null, profile: null, mfaVerified: false });
    persist(null, false);
  }, [persist]);

  const setRole = useCallback((role: UserRole) => {
    const roleUser =
      role === "provider" ? PROVIDER_USER : role === "admin" ? ADMIN_USER : DEMO_USER;
    const p = loadProfile(roleUser.id);
    const synced = p ? syncUserName(roleUser, p) : roleUser;
    setSession({ user: synced, profile: p, mfaVerified: true });
    persist(synced, true);
  }, [persist]);

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user || !profile) return;
      await new Promise((r) => setTimeout(r, 400));
      const updated: UserProfile = {
        ...profile,
        ...data,
        userId: user.id,
        address: { ...profile.address, ...data.address },
        patient: profile.patient
          ? { ...profile.patient, ...data.patient }
          : data.patient,
        provider: profile.provider
          ? { ...profile.provider, ...data.provider }
          : data.provider,
        admin: profile.admin ? { ...profile.admin, ...data.admin } : data.admin,
      };
      if (data.avatarUrl === undefined && "avatarUrl" in data) {
        delete updated.avatarUrl;
      }
      saveProfile(updated);
      const synced = syncUserName(user, updated);
      setSession((prev) => ({ ...prev, user: synced, profile: updated }));
      persist(synced, mfaVerified);
    },
    [user, profile, mfaVerified, persist]
  );

  const changePassword = useCallback(async (currentPassword: string, _newPassword: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (currentPassword !== DEMO_PASSWORD) {
      throw new Error("Current password is incorrect");
    }
    // Mock: password change succeeds; never persist plaintext passwords
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthenticated: user !== null && mfaVerified,
      mfaVerified,
      isLoading,
      login,
      signup,
      requestPasswordReset,
      verifyMfa,
      logout,
      setRole,
      updateProfile,
      changePassword,
    }),
    [
      user,
      profile,
      mfaVerified,
      isLoading,
      login,
      signup,
      requestPasswordReset,
      verifyMfa,
      logout,
      setRole,
      updateProfile,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
