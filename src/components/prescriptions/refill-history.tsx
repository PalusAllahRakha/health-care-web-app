"use client";

import { History } from "lucide-react";
import type { RefillRequest } from "@/types";
import { formatDate, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RefillHistoryProps {
  history: RefillRequest[];
  className?: string;
}

export function RefillHistory({ history, className }: RefillHistoryProps) {
  if (history.length === 0) return null;

  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[var(--color-text-secondary)]" />
          <CardTitle className="text-base">Recent refill history</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.slice(0, 5).map((request) => (
          <div
            key={request.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {request.medicationName}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {request.type === "renewal" ? "Renewal" : "Refill"} · {request.pharmacy} ·{" "}
                {formatRelative(request.requestedAt)}
              </p>
            </div>
            <Badge variant="success">Picked up {formatDate(request.completedAt ?? request.requestedAt)}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
