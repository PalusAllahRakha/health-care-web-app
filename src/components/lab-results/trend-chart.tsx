"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LabResult } from "@/types";
import { cn } from "@/lib/utils";

interface TrendChartProps {
  result: LabResult;
  className?: string;
}

export function TrendChart({ result, className }: TrendChartProps) {
  const data = useMemo(
    () =>
      [...result.history, { date: result.date, value: result.value }]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((point) => ({
          date: new Date(`${point.date}T12:00:00`).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          value: point.value,
        })),
    [result]
  );

  return (
    <div className={cn("h-72 w-full rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
          <Tooltip />
          <ReferenceArea
            y1={result.referenceMin}
            y2={result.referenceMax}
            fill="var(--color-status-normal-bg)"
            fillOpacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-brand-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const TrendChartDynamic = dynamic(
  () => Promise.resolve({ default: TrendChart }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] text-sm text-[var(--color-text-secondary)]">
        Loading chart…
      </div>
    ),
  }
);
