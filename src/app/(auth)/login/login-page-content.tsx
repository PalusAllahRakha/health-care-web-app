"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { AuthRoleTabs } from "@/components/auth/auth-role-tabs";
import { AuthTabSwitcher } from "@/components/auth/auth-tab-switcher";
import { SignupFormByRole } from "@/components/auth/signup-forms";
import {
  forgotPasswordSchema,
  loginSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type PatientSignupInput,
  type ProviderSignupInput,
} from "@/lib/validators/auth";
import type { SignupRole } from "@/lib/auth/registered-accounts";
import { useAuth } from "@/providers/auth-provider";
import { getRoleHomePath } from "@/lib/auth/roles";
import { getTransition } from "@/lib/motion";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MotionSection } from "@/components/motion/motion-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthTab = "signin" | "signup" | "forgot";

const AUTH_TABS: { value: AuthTab; label: string }[] = [
  { value: "signin", label: "Sign in" },
  { value: "signup", label: "Sign up" },
  { value: "forgot", label: "Forgot" },
];

function parseAuthTab(value: string | null): AuthTab {
  if (value === "signup" || value === "forgot") return value;
  return "signin";
}

function syncAuthTabUrl(next: AuthTab) {
  const url = next === "signin" ? "/login" : `/login?tab=${next}`;
  window.history.replaceState(null, "", url);
}

const panelCopy: Record<
  AuthTab,
  { eyebrow: string; title: string; subtitle: string; asideTitle: string; asideSubtitle: string }
> = {
  signin: {
    eyebrow: "Your personal health portal",
    title: "Welcome back.",
    subtitle: "Sign in to pick up where you left off.",
    asideTitle: "Your health.\nA little simpler.",
    asideSubtitle:
      "One place for the people, information, and care that help you feel your best.",
  },
  signup: {
    eyebrow: "Create your account",
    title: "Join HealthPortal.",
    subtitle: "Choose patient or provider, then complete the form.",
    asideTitle: "Join HealthPortal.\nStart in minutes.",
    asideSubtitle:
      "Create a patient or provider account. New demo accounts stay in this browser session only.",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Forgot password?",
    subtitle: "Select your account type, then enter your email.",
    asideTitle: "Forgot your password?\nWe’ll help you reset it.",
    asideSubtitle: "Select patient or provider, then enter the email on that account.",
  },
};

export default function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion() ?? false;
  const { login, signup, requestPasswordReset, isAuthenticated, mfaVerified, user, isLoading } =
    useAuth();

  const [tab, setTab] = useState<AuthTab>(() => parseAuthTab(searchParams.get("tab")));
  const [signupRole, setSignupRole] = useState<SignupRole>("patient");
  const [forgotRole, setForgotRole] = useState<SignupRole>("patient");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSentTo, setResetSentTo] = useState<string | null>(null);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "sarah.chen@email.com", password: "password" },
  });

  const forgotForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (isLoading) return;
    if (user && !mfaVerified) {
      router.replace("/mfa");
      return;
    }
    if (isAuthenticated && user) router.replace(getRoleHomePath(user.role));
  }, [isAuthenticated, mfaVerified, user, isLoading, router]);

  function changeTab(next: AuthTab) {
    setTab(next);
    setLoginError(null);
    setSignupError(null);
    setForgotError(null);
    setResetSentTo(null);
    syncAuthTabUrl(next);
  }

  async function onLogin(data: LoginInput) {
    setLoginError(null);
    try {
      const result = await login(data.email, data.password);
      if (result.mfaRequired) router.push("/mfa");
    } catch {
      setLoginError("Invalid email or password. Try sarah.chen@email.com / password.");
    }
  }

  async function onPatientSignup(data: PatientSignupInput) {
    setSignupError(null);
    try {
      await signup("patient", data);
      toast.success("Account created", {
        description: "Enter 123456 on the next screen to finish signing in.",
      });
      router.push("/mfa");
    } catch (err) {
      setSignupError(
        err instanceof Error ? err.message : "We couldn’t create your account. Please try again."
      );
    }
  }

  async function onProviderSignup(data: ProviderSignupInput) {
    setSignupError(null);
    try {
      await signup("provider", data);
      toast.success("Account created", {
        description: "Enter 123456 on the next screen to finish signing in.",
      });
      router.push("/mfa");
    } catch (err) {
      setSignupError(
        err instanceof Error ? err.message : "We couldn’t create your account. Please try again."
      );
    }
  }

  async function onForgot(data: ForgotPasswordInput) {
    setForgotError(null);
    try {
      await requestPasswordReset(forgotRole, data.email);
      setResetSentTo(data.email.trim());
      toast.success("Reset link sent", {
        description: "In this demo, no email is actually delivered.",
      });
    } catch (err) {
      setForgotError(
        err instanceof Error
          ? err.message
          : "We couldn’t find that account. Check the role tab and email."
      );
    }
  }

  const copy = panelCopy[tab];
  const transition = getTransition(reduced);

  return (
    <AuthLayout
      contentAlign="start"
      contentClassName="max-w-[460px]"
      panelKey={tab}
      title={copy.asideTitle}
      subtitle={copy.asideSubtitle}
    >
      <div className="absolute right-4 top-5 sm:right-8">
        <ThemeToggle />
      </div>

      <MotionSection>
        <div className="relative mb-6 min-h-[108px]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={`heading-${tab}`}
              className="absolute inset-x-0 top-0"
              initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduced ? undefined : { opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={transition}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">
                {copy.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {copy.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AuthTabSwitcher
          value={tab}
          options={AUTH_TABS}
          onValueChange={changeTab}
          className="mb-6"
          layoutId="login-auth-tab-pill"
        />

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ ...transition, duration: reduced ? 0.01 : 0.28 }}
              className="space-y-5"
            >
              {tab === "signin" && (
                <>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="h-12"
                        {...loginForm.register("email")}
                        aria-invalid={!!loginForm.formState.errors.email}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          className="h-12 pr-12"
                          {...loginForm.register("password")}
                          aria-invalid={!!loginForm.formState.errors.password}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                          className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" aria-hidden />
                          ) : (
                            <Eye className="size-4" aria-hidden />
                          )}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    {loginError && (
                      <p
                        className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]"
                        role="alert"
                      >
                        {loginError}
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="h-12 w-full"
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? (
                        <>
                          <HealthSpinner size={16} /> Signing in…
                        </>
                      ) : (
                        <>
                          Sign in to your portal <ArrowRight className="size-4" aria-hidden />
                        </>
                      )}
                    </Button>
                  </form>
                  <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <ShieldCheck className="size-4 text-[var(--color-brand-primary)]" aria-hidden /> An
                    extra layer of protection with two-step verification.
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3.5">
                    <p className="text-xs font-medium">Take a look around</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                      Demo credentials are filled in for you. Use{" "}
                      <span className="font-mono font-medium text-[var(--color-text-primary)]">
                        123456
                      </span>{" "}
                      for the verification code.
                    </p>
                  </div>
                </>
              )}

              {tab === "signup" && (
                <>
                  <AuthRoleTabs
                    value={signupRole}
                    onValueChange={(next) => {
                      setSignupRole(next);
                      setSignupError(null);
                    }}
                    patientLabel="Patient signup"
                    providerLabel="Provider signup"
                    layoutId="signup-role-pill"
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={signupRole}
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0 }}
                      transition={transition}
                      className="min-h-[40px] text-xs leading-5 text-[var(--color-text-secondary)]"
                    >
                      {signupRole === "patient"
                        ? "Patients can book visits, view labs, request refills, and message their care team."
                        : "Providers get access to the patient queue and a clinician profile in this demo."}
                    </motion.p>
                  </AnimatePresence>
                  <SignupFormByRole
                    role={signupRole}
                    onPatientSubmit={onPatientSignup}
                    onProviderSubmit={onProviderSignup}
                    error={signupError}
                  />
                </>
              )}

              {tab === "forgot" &&
                (resetSentTo ? (
                  <div className="space-y-5">
                    <motion.div
                      initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={transition}
                      className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-5"
                    >
                      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                        <MailCheck className="size-5" aria-hidden />
                      </div>
                      <p className="text-sm font-medium">Check your inbox</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                        If an account exists for{" "}
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {resetSentTo}
                        </span>{" "}
                        as a {forgotRole}, a reset link would be sent. This demo only simulates that
                        step.
                      </p>
                    </motion.div>
                    <Button type="button" className="h-12 w-full" onClick={() => changeTab("signin")}>
                      Back to sign in <ArrowRight className="size-4" aria-hidden />
                    </Button>
                    <button
                      type="button"
                      className="w-full text-center text-sm font-medium text-[var(--color-brand-primary)] hover:underline"
                      onClick={() => {
                        setResetSentTo(null);
                        setForgotError(null);
                        forgotForm.reset({ email: "" });
                      }}
                    >
                      Try another email
                    </button>
                  </div>
                ) : (
                  <>
                    <AuthRoleTabs
                      value={forgotRole}
                      onValueChange={(next) => {
                        setForgotRole(next);
                        setForgotError(null);
                      }}
                      patientLabel="Patient account"
                      providerLabel="Provider account"
                      layoutId="forgot-role-pill"
                    />
                    <form
                      onSubmit={forgotForm.handleSubmit(onForgot)}
                      className="space-y-5"
                      noValidate
                    >
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">
                          {forgotRole === "patient" ? "Patient email" : "Provider work email"}
                        </Label>
                        <Input
                          id="reset-email"
                          type="email"
                          autoComplete="email"
                          className="h-12"
                          placeholder={
                            forgotRole === "patient"
                              ? "sarah.chen@email.com"
                              : "j.wilson@healthcare.org"
                          }
                          {...forgotForm.register("email")}
                          aria-invalid={!!forgotForm.formState.errors.email}
                        />
                        {forgotForm.formState.errors.email && (
                          <p className="text-sm text-[var(--color-status-critical)]" role="alert">
                            {forgotForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      {forgotError && (
                        <p
                          className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]"
                          role="alert"
                        >
                          {forgotError}
                        </p>
                      )}
                      <Button
                        type="submit"
                        className="h-12 w-full"
                        disabled={forgotForm.formState.isSubmitting}
                      >
                        {forgotForm.formState.isSubmitting ? (
                          <>
                            <HealthSpinner size={16} /> Sending link…
                          </>
                        ) : (
                          <>
                            Send reset link <ArrowRight className="size-4" aria-hidden />
                          </>
                        )}
                      </Button>
                    </form>
                    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3.5">
                      <p className="text-xs font-medium">Demo accounts</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                        Patient:{" "}
                        <span className="font-mono text-[var(--color-text-primary)]">
                          sarah.chen@email.com
                        </span>
                        {" · "}
                        Provider:{" "}
                        <span className="font-mono text-[var(--color-text-primary)]">
                          j.wilson@healthcare.org
                        </span>
                      </p>
                    </div>
                  </>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </MotionSection>
    </AuthLayout>
  );
}
