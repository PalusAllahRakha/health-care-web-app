"use client";

import { Suspense } from "react";
import LoginPageContent from "./login-page-content";
import { AuthLayout } from "@/components/layout/auth-layout";
import { HealthSpinner } from "@/components/shared/health-spinner";

function LoginFallback() {
  return (
    <AuthLayout>
      <div className="flex min-h-[240px] items-center justify-center">
        <HealthSpinner size={28} />
      </div>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
