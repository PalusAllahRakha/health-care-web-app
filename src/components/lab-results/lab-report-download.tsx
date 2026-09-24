"use client";

import { useCallback, useState } from "react";
import { ChevronDown, Download, FileImage, FileText } from "lucide-react";
import { HealthSpinner } from "@/components/shared/health-spinner";
import {
  exportLabReportImage,
  exportLabReportPdf,
  type LabReportImageFormat,
} from "@/lib/lab-report-export";
import { useAuth } from "@/providers/auth-provider";
import type { LabResult } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export interface LabReportDownloadProps {
  results: LabResult[];
  patientName?: string;
  className?: string;
  compact?: boolean;
}

type DownloadFormat = "pdf" | LabReportImageFormat;

const FORMATS: {
  id: DownloadFormat;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  { id: "pdf", label: "PDF document", description: "Best for printing and sharing", icon: FileText },
  { id: "png", label: "PNG image", description: "High-quality screenshot", icon: FileImage },
  { id: "webp", label: "WebP image", description: "Smaller file size", icon: FileImage },
];

export function LabReportDownload({
  results,
  patientName,
  className,
  compact = false,
}: LabReportDownloadProps) {
  const { user } = useAuth();
  const [loadingFormat, setLoadingFormat] = useState<DownloadFormat | null>(null);
  const [open, setOpen] = useState(false);
  const resolvedPatientName = patientName ?? user?.name ?? "Patient";
  const disabled = results.length === 0 || loadingFormat !== null;

  const handleDownload = useCallback(
    async (format: DownloadFormat) => {
      if (results.length === 0) return;

      setLoadingFormat(format);
      setOpen(false);
      try {
        if (format === "pdf") {
          await exportLabReportPdf(results, { patientName: resolvedPatientName });
        } else {
          await exportLabReportImage(results, format, { patientName: resolvedPatientName });
        }
        toast.success("Download started", {
          description: `Lab report saved as ${format.toUpperCase()}.`,
        });
      } catch {
        toast.error("Download failed", {
          description: "Could not generate the lab report. Please try again.",
        });
      } finally {
        setLoadingFormat(null);
      }
    },
    [results, resolvedPatientName]
  );

  const trigger = (
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        disabled={disabled}
        className={cn(compact ? "min-w-[132px]" : "min-w-[160px]")}
      >
        {loadingFormat ? (
          <HealthSpinner size={14} aria-hidden />
        ) : (
          <Download className="h-4 w-4" aria-hidden />
        )}
        Download
        <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
      </Button>
    </DropdownMenuTrigger>
  );

  const menu = (
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>Choose format</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {FORMATS.map(({ id, label, description, icon: Icon }) => (
        <DropdownMenuItem
          key={id}
          disabled={disabled}
          onSelect={(event) => {
            event.preventDefault();
            void handleDownload(id);
          }}
        >
          <Icon className="h-4 w-4 text-[var(--color-brand-primary)]" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium">{label}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );

  if (compact) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <div className={className}>{trigger}</div>
        {menu}
      </DropdownMenu>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40 p-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Download report</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Export as PDF, PNG, or WebP from the menu.
          </p>
        </div>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          {trigger}
          {menu}
        </DropdownMenu>
      </div>
    </div>
  );
}
