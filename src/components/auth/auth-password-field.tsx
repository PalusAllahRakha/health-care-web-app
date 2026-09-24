"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface AuthPasswordFieldProps {
  id: string;
  label: string;
  autoComplete?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className?: string;
}

export function AuthPasswordField({
  id,
  label,
  autoComplete = "new-password",
  error,
  registration,
  className,
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          className="h-12 pr-12"
          {...registration}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]"
        >
          {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-[var(--color-status-critical)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
