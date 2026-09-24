"use client";

import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { useAuth } from "@/providers/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { AvatarCropDialog } from "@/components/profile/avatar-crop-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ProfileAvatarUpload({ className }: { className?: string }) {
  const { user, profile, updateProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  if (!user || !profile) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setCropSrc(dataUrl);
      setCropOpen(true);
    } catch {
      setError("Could not load image. Please try again.");
    }
  }

  async function handleCropComplete(dataUrl: string) {
    setIsUploading(true);
    try {
      await updateProfile({ avatarUrl: dataUrl });
      setCropSrc(null);
    } catch {
      setError("Could not save image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setIsUploading(true);
    try {
      await updateProfile({ avatarUrl: undefined });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <div className={cn("flex flex-col items-center gap-3 sm:items-start", className)}>
        <div className="relative">
          <UserAvatar
            name={user.name}
            avatarUrl={profile.avatarUrl}
            className="h-20 w-20 bg-[var(--color-surface-muted)] ring-2 ring-[var(--color-brand-primary)]/25"
            fallbackClassName="text-lg"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-brand-primary)] text-white shadow-[var(--shadow-medium)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Change profile picture"
          >
            {isUploading ? <HealthSpinner size={16} /> : <Camera className="h-4 w-4" />}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Upload profile picture"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            Upload photo
          </Button>
          {profile.avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUploading}
              onClick={handleRemove}
              className="text-[var(--color-status-critical)] hover:text-[var(--color-status-critical)]"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-[var(--color-text-disabled)] sm:text-left">
          JPG, PNG, or WebP. Max 5 MB. You can crop after selecting.
        </p>
        {error && (
          <p className="text-center text-xs text-[var(--color-status-critical)] sm:text-left" role="alert">
            {error}
          </p>
        )}
      </div>

      <AvatarCropDialog
        open={cropOpen}
        imageSrc={cropSrc}
        onOpenChange={(open) => {
          setCropOpen(open);
          if (!open) setCropSrc(null);
        }}
        onComplete={handleCropComplete}
      />
    </>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Invalid file"));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
