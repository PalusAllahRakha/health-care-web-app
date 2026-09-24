"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { mfaSchema, type MfaInput } from "@/lib/validators/auth";
import { useAuth } from "@/providers/auth-provider";
import { getRoleHomePath } from "@/lib/auth/roles";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MotionSection } from "@/components/motion/motion-section";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function MfaPage() {
  const router = useRouter();
  const { verifyMfa, user, mfaVerified, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const { handleSubmit, setValue, formState: { isSubmitting } } = useForm<MfaInput>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (isAuthenticated && mfaVerified && user) router.replace(getRoleHomePath(user.role));
  }, [user, isAuthenticated, mfaVerified, isLoading, router]);

  function updateDigits(next: string[]) {
    setError(null);
    setDigits(next);
    setValue("code", next.join(""), { shouldValidate: true });
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    updateDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const code = event.clipboardData.getData("text").replace(/\s/g, "");
    if (!/^\d{1,6}$/.test(code)) return;
    updateDigits(Array.from({ length: 6 }, (_, index) => code[index] ?? ""));
    inputRefs.current[Math.min(code.length, 5)]?.focus();
  }

  async function onSubmit(data: MfaInput) {
    setError(null);
    try {
      const ok = await verifyMfa(data.code);
      if (ok && user) router.replace(getRoleHomePath(user.role));
      else setError("That code doesn’t match. Try 123456 for the demo.");
    } catch {
      setError("We couldn’t verify your code. Please try again.");
    }
  }

  return (
    <AuthLayout title={"A little more security.\nA lot more peace of mind."} subtitle="Your health information is personal. A second verification step helps keep your account in your hands.">
      <div className="absolute right-4 top-5 sm:right-8"><ThemeToggle /></div>
      <MotionSection delay={0.05}>
        <div className="mb-8">
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"><ShieldCheck className="size-6" aria-hidden /></div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-primary)]">Two-step verification</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">One more step.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">Enter the six-digit code from your authenticator app to securely access your portal.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <p id="code-label" className="mb-3 text-sm font-medium">Verification code</p>
            <div className="flex gap-2 sm:gap-3" role="group" aria-labelledby="code-label" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => { inputRefs.current[index] = element; }}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onFocus={(event) => event.target.select()}
                  disabled={isSubmitting}
                  className={cn("h-14 min-w-0 flex-1 px-0 text-center text-xl font-semibold", digit && "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5")}
                  aria-label={`Digit ${index + 1}`}
                  aria-invalid={!!error}
                  aria-describedby={error ? "code-error" : undefined}
                />
              ))}
            </div>
          </div>
          {error && <p id="code-error" className="rounded-lg bg-[var(--color-status-critical-bg)] px-3 py-3 text-sm text-[var(--color-status-critical-text)]" role="alert">{error}</p>}
          <Button type="submit" className="h-12 w-full" disabled={digits.join("").length !== 6 || isSubmitting}>
            {isSubmitting ? <><HealthSpinner size={16} /> Verifying…</> : <>Verify & continue <ArrowRight className="size-4" aria-hidden /></>}
          </Button>
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3.5">
            <p className="text-xs font-medium">Exploring the demo?</p>
            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">Enter <span className="font-mono font-medium tracking-widest text-[var(--color-text-primary)]">123456</span> to continue. You can also paste the full code.</p>
          </div>
        </form>
      </MotionSection>
    </AuthLayout>
  );
}
