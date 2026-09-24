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

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  mfaVerified: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ mfaRequired: boolean }>;
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

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (email === "sarah.chen@email.com" && password === "password") {
      const p = loadProfile(DEMO_USER.id);
      const synced = p ? syncUserName(DEMO_USER, p) : DEMO_USER;
      setSession({ user: synced, profile: p, mfaVerified: false });
      persist(synced, false);
      setIsLoading(false);
      return { mfaRequired: true };
    }
    setIsLoading(false);
    throw new Error("Invalid credentials");
  }, [persist]);

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
      verifyMfa,
      logout,
      setRole,
      updateProfile,
      changePassword,
    }),
    [user, profile, mfaVerified, isLoading, login, verifyMfa, logout, setRole, updateProfile, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
