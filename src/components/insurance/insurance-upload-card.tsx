"use client";

import { useCallback, useRef, useState } from "react";
import { CreditCard, Shield, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

type CardSide = "front" | "back";

export interface InsuranceUploadCardProps {
  onUpload?: (data: {
    planName: string;
    memberId: string;
    groupNumber: string;
    cardFront: File;
    cardBack: File;
  }) => void;
  className?: string;
}

export function InsuranceUploadCard({ onUpload, className }: InsuranceUploadCardProps) {
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const [planName, setPlanName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [cardFront, setCardFront] = useState<File | null>(null);
  const [cardBack, setCardBack] = useState<File | null>(null);
  const [dragSide, setDragSide] = useState<CardSide | null>(null);

  const handleDrop = useCallback(
    (side: CardSide) => (e: React.DragEvent) => {
      e.preventDefault();
      setDragSide(null);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (side === "front") setCardFront(file);
      else setCardBack(file);
    },
    []
  );

  const handleFileInput = useCallback(
    (side: CardSide) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (side === "front") setCardFront(file);
      else setCardBack(file);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (!cardFront || !cardBack) return;
    onUpload?.({ planName, memberId, groupNumber, cardFront, cardBack });
    toast.success("Insurance info submitted", {
      description: "Your plan details and card images were saved successfully.",
    });
  }, [planName, memberId, groupNumber, cardFront, cardBack, onUpload]);

  const renderDropZone = (side: CardSide, file: File | null) => (
    <div
      onDrop={handleDrop(side)}
      onDragOver={(e) => { e.preventDefault(); setDragSide(side); }}
      onDragLeave={() => setDragSide(null)}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed p-5 text-center transition-all",
        dragSide === side
          ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5 scale-[1.02]"
          : file
            ? "border-[var(--color-status-normal-border)] bg-[var(--color-status-normal-bg)]/50"
            : "border-[var(--color-border-strong)] hover:border-[var(--color-brand-primary)]/40"
      )}
    >
      <CreditCard className="h-7 w-7 text-[var(--color-brand-primary)]" aria-hidden />
      <p className="mt-2 text-sm font-semibold capitalize">Card {side}</p>
      {file ? (
        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--color-status-normal-text)]">
          <span className="max-w-[120px] truncate font-medium">{file.name}</span>
          <button type="button" onClick={() => (side === "front" ? setCardFront(null) : setCardBack(null))} aria-label={`Remove ${side} card`}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-xs text-[var(--color-text-disabled)]">Drag & drop or browse</p>
          <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => (side === "front" ? frontRef : backRef).current?.click()}>
            <Upload className="h-3.5 w-3.5" />
            Browse
          </Button>
        </>
      )}
      <input ref={side === "front" ? frontRef : backRef} type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={handleFileInput(side)} />
    </div>
  );

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-5 w-5 text-[var(--color-brand-primary)]" />
          Update insurance card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan name</Label>
            <Input id="plan-name" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="BlueCross PPO" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-id">Member ID</Label>
            <Input id="member-id" value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="Member ID" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-number">Group number</Label>
            <Input id="group-number" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} placeholder="Group #" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {renderDropZone("front", cardFront)}
          {renderDropZone("back", cardBack)}
        </div>

        <Button type="button" className="w-full shadow-[var(--shadow-glow)]" disabled={!planName || !memberId || !groupNumber || !cardFront || !cardBack} onClick={handleSubmit}>
          Submit insurance info
        </Button>
      </CardContent>
    </Card>
  );
}
