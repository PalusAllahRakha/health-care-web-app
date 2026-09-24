"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import type { Doctor } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingStars } from "@/components/doctors/rating-stars";
import { AvailabilityBadge } from "@/components/doctors/availability-badge";
import { cn } from "@/lib/utils";

export interface DoctorProfileCardProps {
  doctor: Doctor;
  onBook?: (doctorId: string) => void;
  className?: string;
}

function getInitials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const DoctorProfileCard = memo(function DoctorProfileCard({
  doctor,
  onBook,
  className,
}: DoctorProfileCardProps) {
  return (
    <Card className={cn("card-hover flex flex-col", className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <Avatar className="h-14 w-14 rounded-xl border border-[var(--color-border-subtle)]">
          {doctor.image && <AvatarImage src={doctor.image} alt={doctor.name} />}
          <AvatarFallback className="rounded-xl bg-[var(--color-brand-tint)] text-base font-medium text-[var(--color-brand-strong)]">
            {getInitials(doctor.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base leading-snug">{doctor.name}</CardTitle>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]"><Stethoscope className="h-3.5 w-3.5" aria-hidden />{doctor.specialty}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RatingStars rating={doctor.rating} />
            <span className="text-xs text-[var(--color-text-secondary)]">
              {doctor.reviewCount} reviews
            </span>
          </div>
        </div>
      </CardHeader>
      {doctor.bio && (
        <CardContent className="flex-1 pt-0">
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{doctor.bio}</p>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-subtle)] pb-4 pt-4">
        <AvailabilityBadge availability={doctor.availability} />
        {onBook ? (
          <Button
            size="sm"
            onClick={() => onBook(doctor.id)}
            disabled={doctor.availability === "unavailable"}
          >
            Book visit <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        ) : doctor.availability === "unavailable" ? (
          <Button size="sm" disabled>Unavailable</Button>
        ) : (
          <Button asChild size="sm">
            <Link href={`/appointments?doctor=${doctor.id}`}>Book visit</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
