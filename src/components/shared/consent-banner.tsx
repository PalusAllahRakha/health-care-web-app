"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONSENT_KEY = "healthcare-consent-accepted";

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const hasConsent = () => localStorage.getItem(CONSENT_KEY) === "true";
const serverConsent = () => true;

export function ConsentBanner({ className }: { className?: string }) {
  const accepted = useSyncExternalStore(subscribeToConsent, hasConsent, serverConsent);
  const [dismissed, setDismissed] = useState(false);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "true");
    setDismissed(true);
  }, []);

  const decline = useCallback(() => {
    setDismissed(true);
  }, []);

  if (accepted || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
      className={cn(
        "fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-elevated)] lg:inset-x-auto lg:bottom-6 lg:right-6 lg:max-w-md",
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-brand-primary)]">
          <Cookie className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p
            id="consent-title"
            className="text-sm font-semibold text-[var(--color-text-primary)]"
          >
            Privacy & cookies
          </p>
          <p
            id="consent-description"
            className="mt-1 text-xs text-[var(--color-text-secondary)]"
          >
            We use essential cookies to keep you signed in and improve your
            healthcare experience. See our privacy policy for details.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={accept} className="min-h-11">
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={decline} className="min-h-11">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
