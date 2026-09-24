"use client";

import { useCallback, useMemo } from "react";
import { MapPin } from "lucide-react";
import { prescriptions } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PharmacySelectorProps {
  value: string;
  onChange: (pharmacy: string) => void;
  className?: string;
}

export function PharmacySelector({ value, onChange, className }: PharmacySelectorProps) {
  const pharmacies = useMemo(() => {
    return [...new Set(prescriptions.map((p) => p.pharmacy))].sort();
  }, []);

  const handleChange = useCallback(
    (selected: string) => {
      onChange(selected);
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="pharmacy-select">Preferred Pharmacy</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="pharmacy-select">
          <SelectValue placeholder="Select a pharmacy" />
        </SelectTrigger>
        <SelectContent>
          {pharmacies.map((pharmacy) => (
            <SelectItem key={pharmacy} value={pharmacy}>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" aria-hidden />
                {pharmacy}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
