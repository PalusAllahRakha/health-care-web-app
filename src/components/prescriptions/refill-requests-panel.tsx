"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, MapPin, MessageSquare } from "lucide-react";
import {
  getNextAction,
  getStatusBadgeVariant,
  getStatusLabel,
  getStatusMessage,
} from "@/lib/refill-utils";
import type { RefillRequest } from "@/types";
import { cn, formatDate, formatRelative } from "@/lib/utils";
import { RefillProgressBar } from "@/components/prescriptions/refill-progress-bar";
import { RefillTimeline } from "@/components/prescriptions/refill-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RefillRequestsPanelProps {
  requests: RefillRequest[];
  className?: string;
}

export function RefillRequestsPanel({ requests, className }: RefillRequestsPanelProps) {
  if (requests.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">Refill tracker</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Live status updates — steps advance automatically as your pharmacy processes the order.
          </p>
        </div>
        <Badge variant="secondary">{requests.length} active</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {requests.map((request, index) => {
          const nextAction = getNextAction(request.status, request.type);
          const statusMessage = getStatusMessage(
            request.status,
            request.type,
            formatDate(request.estimatedReadyAt),
            request.pickupMethod
          );

          return (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
            >
              <Card className="overflow-hidden border-[var(--color-brand-primary)]/20 shadow-[var(--shadow-subtle)]">
                <div className="h-1 bg-[var(--color-brand-primary)]" aria-hidden />
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">{request.medicationName}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-brand-primary)]">{request.dosage}</p>
                      <p className="mt-1 text-xs text-[var(--color-text-disabled)]">
                        Requested {formatRelative(request.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <RefillProgressBar request={request} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{statusMessage}</p>

                  <div className="rounded-[var(--radius-md)] border border-[var(--color-brand-primary)]/15 bg-[var(--color-brand-primary)]/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-primary)]">
                      What to do now
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                      {nextAction.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                      {nextAction.hint}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-3 text-xs">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{request.pharmacy}</p>
                        <p className="text-[var(--color-text-secondary)]">
                          Est. {formatDate(request.estimatedReadyAt)} ·{" "}
                          {request.pickupMethod === "mail" ? "Mail" : "Pickup"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-3 text-xs">
                      <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">Auto-updates</p>
                        <p className="text-[var(--color-text-secondary)]">
                          We&apos;ll notify you when status changes
                        </p>
                      </div>
                    </div>
                  </div>

                  <RefillTimeline request={request} />

                  {request.status === "renewal_pending" && (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/messages">
                        <MessageSquare className="h-4 w-4" />
                        Message your provider
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
