"use client";

import { useEffect, useState } from "react";
import { Clock3, LockKeyhole, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PROVIDER_REVIEW_WORKING_DAYS,
  resolveStatus,
  timeUntilReview,
  type ProviderRecord,
} from "@/lib/auth/provider-approvals";

function ClockUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center sm:px-5">
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#b6ccc1]">{label}</p>
    </div>
  );
}

export function ProviderApprovalLock({
  record,
  onSignOut,
}: {
  record: ProviderRecord;
  onSignOut: () => void;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const status = resolveStatus(record, now);
  const remaining = timeUntilReview(record.submittedAt, now);
  const deadline = remaining.deadline;
  const locked = status !== "approved";

  const title =
    status === "rejected"
      ? "Signup was not approved"
      : status === "expired"
        ? "Review window has closed"
        : "Workspace locked";

  const detail =
    status === "rejected"
      ? "An administrator declined this provider signup. Contact the clinic admin if you believe this was a mistake."
      : status === "expired"
        ? `Administrators have ${PROVIDER_REVIEW_WORKING_DAYS} working days to approve a provider signup. That window has passed, so this workspace stays locked.`
        : `Your provider signup is waiting for an administrator. Approval is required within ${PROVIDER_REVIEW_WORKING_DAYS} working days. This screen stays locked until that request is approved.`;

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#102e2a] px-4 text-[#dce9e2]">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#173c38] p-6 shadow-2xl sm:p-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c7e7ce] text-[#173c38]">
          {status === "pending" ? <LockKeyhole className="h-7 w-7" /> : <ShieldAlert className="h-7 w-7" />}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c7e7ce]">Provider signup</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#b6ccc1]">{detail}</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/15 px-4 py-4">
          <p className="font-semibold text-white">{record.name}</p>
          <p className="mt-1 text-sm text-[#b6ccc1]">{record.email}</p>
          <p className="mt-1 text-sm text-[#b6ccc1]">
            {record.specialty} · {record.licenseNumber}
          </p>
        </div>

        {status === "pending" && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm text-[#c7e7ce]">
              <Clock3 className="h-4 w-4" />
              Time left for admin approval
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <ClockUnit value={remaining.days} label="Work days" />
              <ClockUnit value={remaining.hours} label="Hours" />
              <ClockUnit value={remaining.minutes} label="Min" />
              <ClockUnit value={remaining.seconds} label="Sec" />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#b6ccc1]">
              Deadline {deadline.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}.
              Countdown starts at {PROVIDER_REVIEW_WORKING_DAYS} working days (weekends excluded).
              Hours count working time only — not calendar time over the weekend.
            </p>
          </div>
        )}

        <Button type="button" variant="secondary" className="mt-8 w-full bg-white text-[#173c38] hover:bg-[#c7e7ce]" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
