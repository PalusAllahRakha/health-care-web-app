"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { useAuth } from "@/providers/auth-provider";
import { getRoleHomePath } from "@/lib/auth/roles";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MotionSection } from "@/components/motion/motion-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, mfaVerified, user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "sarah.chen@email.com", password: "password" },
  });

  useEffect(() => {
    if (isLoading) return;
    if (user && !mfaVerified) { router.replace("/mfa"); return; }
    if (isAuthenticated && user) router.replace(getRoleHomePath(user.role));
  }, [isAuthenticated, mfaVerified, user, isLoading, router]);

  async function onSubmit(data: LoginInput) {
    setError(null);
    try {
      const result = await login(data.email, data.password);
      if (result.mfaRequired) router.push("/mfa");
    } catch {
      setError("Invalid email or password. Try sarah.chen@email.com / password.");
    }
  }

  return (
    <AuthLayout>
      <div className="absolute right-4 top-5 sm:right-8"><ThemeToggle /></div>
      <MotionSection>
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">Your personal health portal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Welcome back.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">Sign in to pick up where you left off.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" autoComplete="email" className="h-12" {...register("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <p id="email-error" className="text-sm text-[var(--color-status-critical)]" role="alert">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="h-12 pr-12" {...register("password")} aria-invalid={!!errors.password} aria-describedby={errors.password ? "password-error" : undefined} />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]">{showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}</button>
            </div>
            {errors.password && <p id="password-error" className="text-sm text-[var(--color-status-critical)]" role="alert">{errors.password.message}</p>}
          </div>
          {error && <p className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]" role="alert">{error}</p>}
          <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
            {isSubmitting ? <><HealthSpinner size={16} /> Signing in…</> : <>Sign in to your portal <ArrowRight className="size-4" aria-hidden /></>}
          </Button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]"><ShieldCheck className="size-4 text-[var(--color-brand-primary)]" aria-hidden /> An extra layer of protection with two-step verification.</div>
        <div className="mt-8 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3.5">
          <p className="text-xs font-medium">Take a look around</p>
          <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">Demo credentials are filled in for you. Use <span className="font-mono font-medium text-[var(--color-text-primary)]">123456</span> for the verification code.</p>
        </div>
      </MotionSection>
    </AuthLayout>
  );
}
