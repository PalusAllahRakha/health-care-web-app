"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { File, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AttachmentUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSizeMb?: number;
  className?: string;
}

function AttachmentUploaderInner({
  onFilesSelected,
  accept = "image/*,.pdf,.doc,.docx",
  maxSizeMb = 10,
  className,
}: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const maxBytes = maxSizeMb * 1024 * 1024;
      const valid = list.filter((f) => f.size <= maxBytes);

      if (valid.length < list.length) {
        setError(`Files must be under ${maxSizeMb}MB`);
      } else {
        setError(null);
      }

      if (valid.length > 0) {
        setFiles((prev) => [...prev, ...valid]);
        onFilesSelected(valid);
      }
    },
    [maxSizeMb, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) validateAndSet(e.dataTransfer.files);
    },
    [validateAndSet]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) validateAndSet(e.target.files);
    },
    [validateAndSet]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed p-6 text-center transition-colors",
          dragOver
            ? "border-[var(--color-brand-primary)] bg-[var(--color-surface-muted)]"
            : "border-[var(--color-border-strong)] hover:border-[var(--color-brand-primary)]"
        )}
      >
        <Upload className="h-8 w-8 text-[var(--color-text-secondary)]" aria-hidden />
        <p className="mt-2 text-sm font-medium text-[var(--color-text-primary)]">
          Drag & drop files here
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          or click to browse (max {maxSizeMb}MB)
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="text-sm text-[var(--color-status-critical)]">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2 truncate">
                <File className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-2 shrink-0 text-[var(--color-text-secondary)] hover:text-[var(--color-status-critical)]"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const AttachmentUploader = dynamic(
  () => Promise.resolve({ default: AttachmentUploaderInner }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-32 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] text-sm text-[var(--color-text-secondary)]">
        Loading uploader…
      </div>
    ),
  }
);
