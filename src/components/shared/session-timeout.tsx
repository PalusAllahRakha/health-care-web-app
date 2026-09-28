"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_BEFORE_MS = 2 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;

export interface SessionTimeoutProps {
  timeoutMs?: number;
  warningMs?: number;
  onExtend?: () => void;
  onTimeout?: () => void;
}

export function SessionTimeout({
  timeoutMs = IDLE_TIMEOUT_MS,
  warningMs = WARNING_BEFORE_MS,
  onExtend,
  onTimeout,
}: SessionTimeoutProps) {
  const [warningOpen, setWarningOpen] = useState(false);
  const lastActivityRef = useRef(0);
  const warningShownRef = useRef(false);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    setWarningOpen(false);
  }, []);

  const handleExtend = useCallback(() => {
    resetActivity();
    onExtend?.();
  }, [onExtend, resetActivity]);

  const handleSignOut = useCallback(() => {
    setWarningOpen(false);
    onTimeout?.();
  }, [onTimeout]);

  useEffect(() => {
    if (lastActivityRef.current === 0) lastActivityRef.current = Date.now();
    const handleActivity = () => {
      if (!warningOpen) {
        lastActivityRef.current = Date.now();
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true, capture: event === "scroll" });
    }

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const timeUntilTimeout = timeoutMs - elapsed;

      if (timeUntilTimeout <= 0) {
        onTimeout?.();
        setWarningOpen(false);
        return;
      }

      if (timeUntilTimeout <= warningMs && !warningShownRef.current) {
        warningShownRef.current = true;
        setWarningOpen(true);
      }
    }, 10000);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity, event === "scroll");
      }
      window.clearInterval(interval);
    };
  }, [onTimeout, timeoutMs, warningMs, warningOpen]);

  return (
    <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-status-borderline-bg)] text-[var(--color-status-borderline-icon)]">
            <Clock className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle className="text-center">Session expiring soon</DialogTitle>
          <DialogDescription className="text-center">
            For your security, you will be signed out due to inactivity. Would you
            like to stay signed in?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleExtend} className="w-full min-h-11">
            Stay signed in
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full min-h-11"
          >
            Sign out now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
