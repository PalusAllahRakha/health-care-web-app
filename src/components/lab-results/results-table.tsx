"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpRight } from "lucide-react";
import type { LabResult } from "@/types";
import { SeverityBadge } from "@/components/lab-results/severity-badge";
import { cn, formatDate } from "@/lib/utils";

type SortKey = "testName" | "value" | "date" | "flag";
type SortDir = "asc" | "desc";

const FLAG_ORDER: Record<LabResult["flag"], number> = {
  critical: 0,
  borderline: 1,
  normal: 2,
};

export interface ResultsTableProps {
  results: LabResult[];
  className?: string;
  onRowClick?: (result: LabResult) => void;
}

interface ResultRowProps {
  result: LabResult;
  onRowClick?: (result: LabResult) => void;
}

const ResultRow = memo(function ResultRow({ result, onRowClick }: ResultRowProps) {
  const handleClick = useCallback(() => {
    onRowClick?.(result);
  }, [onRowClick, result]);

  return (
    <tr
      className={cn(
        "border-b border-[var(--color-border-subtle)] transition-colors duration-200 last:border-b-0",
        onRowClick && "cursor-pointer hover:bg-[var(--color-brand-primary)]/5 hover:shadow-[inset_3px_0_0_var(--color-brand-primary)]"
      )}
      onClick={onRowClick ? handleClick : undefined}
    >
      <td className="px-5 py-5 text-sm font-medium text-[var(--color-text-primary)]">
        {onRowClick ? <button type="button" onClick={(event) => { event.stopPropagation(); handleClick(); }} className="group inline-flex min-h-8 items-center gap-2 text-left hover:text-[var(--color-brand-primary)]">
          {result.testName}<ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-brand-primary)]" aria-hidden />
        </button> : result.testName}
      </td>
      <td className="px-4 py-3 text-sm tabular-nums text-[var(--color-text-primary)]">
        {result.value} {result.unit}
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {result.referenceMin}–{result.referenceMax} {result.unit}
      </td>
      <td className="px-4 py-3">
        <SeverityBadge flag={result.flag} />
      </td>
      <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
        {formatDate(result.date)}
      </td>
    </tr>
  );
});

export function ResultsTable({ results, className, onRowClick }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return key;
    });
  }, []);

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "testName":
          cmp = a.testName.localeCompare(b.testName);
          break;
        case "value":
          cmp = a.value - b.value;
          break;
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "flag":
          cmp = FLAG_ORDER[a.flag] - FLAG_ORDER[b.flag];
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [results, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  const columns: { key: SortKey | null; label: string }[] = [
    { key: "testName", label: "Test" },
    { key: "value", label: "Result" },
    { key: null, label: "Reference" },
    { key: "flag", label: "Status" },
    { key: "date", label: "Date" },
  ];

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-subtle)]",
        className
      )}
    >
      <table className="w-full min-w-[640px] text-left">
        <caption className="sr-only">Lab test results. Select a test name for details; use the column headings to sort.</caption>
        <thead>
          <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/60">
            {columns.map((col, i) => (
              <th
                key={`${col.label}-${i}`}
                scope="col"
                aria-sort={col.key === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]"
              >
                {col.key ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-text-primary)]"
                    onClick={() => handleSort(col.key!)}
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result) => (
            <ResultRow key={result.id} result={result} onRowClick={onRowClick} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
