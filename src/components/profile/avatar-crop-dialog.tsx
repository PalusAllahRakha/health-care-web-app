"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { getCroppedImageDataUrl } from "@/lib/image-crop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AvatarCropDialogProps {
  open: boolean;
  imageSrc: string | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (dataUrl: string) => Promise<void>;
}

export function AvatarCropDialog({
  open,
  imageSrc,
  onOpenChange,
  onComplete,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;
    setError(null);
    setIsSaving(true);
    try {
      const dataUrl = await getCroppedImageDataUrl(imageSrc, croppedAreaPixels);
      await onComplete(dataUrl);
      onOpenChange(false);
    } catch {
      setError("Could not crop image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setError(null);
    }
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 px-6 pt-6">
          <DialogTitle>Crop profile photo</DialogTitle>
          <DialogDescription>Drag to reposition and use the slider to zoom.</DialogDescription>
        </DialogHeader>

        <div className="relative mx-6 mt-4 aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)]">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        <div className="space-y-2 px-6 py-4">
          <Label htmlFor="crop-zoom" className="text-xs text-[var(--color-text-disabled)]">
            Zoom
          </Label>
          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border-strong)] accent-[var(--color-brand-primary)]"
          />
        </div>

        {error && (
          <p className="px-6 text-sm text-[var(--color-status-critical)]" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="border-t border-[var(--color-border-subtle)] px-6 py-4">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving || !croppedAreaPixels}>
            {isSaving ? (
              <>
                <HealthSpinner size={16} className="mr-2" />
                Saving…
              </>
            ) : (
              "Save photo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
