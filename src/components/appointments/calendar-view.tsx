"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CalendarViewProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  onSelectDate?: (date: string) => void;
  markedDates?: string[];
  minDate?: Date;
  disableWeekends?: boolean;
  className?: string;
}

export function CalendarView({
  selectedDate,
  onDateSelect,
  onSelectDate,
  markedDates = [],
  minDate = new Date(),
  disableWeekends = false,
  className,
}: CalendarViewProps) {
  const [calendar, setCalendar] = useState(() => ({
    selectedDate,
    month: startOfMonth(selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date()),
  }));
  // Follow an external date change while keeping month navigation independent.
  if (selectedDate !== calendar.selectedDate) {
    setCalendar({
      selectedDate,
      month: selectedDate ? startOfMonth(new Date(`${selectedDate}T12:00:00`)) : calendar.month,
    });
  }
  const currentMonth = calendar.month;
  const handleDateChange = onDateSelect ?? onSelectDate;
  const minDay = useMemo(() => startOfDay(minDate), [minDate]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const markedSet = useMemo(() => new Set(markedDates), [markedDates]);
  const selected = selectedDate ? new Date(`${selectedDate}T12:00:00`) : undefined;

  const handlePrev = useCallback(() => {
    setCalendar((current) => ({ ...current, month: addMonths(current.month, -1) }));
  }, []);

  const handleNext = useCallback(() => {
    setCalendar((current) => ({ ...current, month: addMonths(current.month, 1) }));
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      const dayStart = startOfDay(day);
      if (dayStart < minDay && !isSameDay(dayStart, minDay)) return;
      if (disableWeekends && (getDay(day) === 0 || getDay(day) === 6)) return;
      handleDateChange?.(format(day, "yyyy-MM-dd"));
    },
    [minDay, disableWeekends, handleDateChange]
  );

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("select-none overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-subtle)]", className)}>
      <div className="mb-4 flex items-center justify-between">
        <Button type="button" variant="ghost" size="icon" onClick={handlePrev} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]" aria-live="polite">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={handleNext} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const disabled =
            (startOfDay(day) < minDay && !isSameDay(day, minDay)) ||
            (disableWeekends && isWeekend);
          const dayKey = format(day, "yyyy-MM-dd");
          const hasMark = markedSet.has(dayKey);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              aria-label={`${format(day, "EEEE, MMMM d, yyyy")}${hasMark ? ", appointment scheduled" : ""}`}
              aria-pressed={isSelected}
              aria-current={isToday(day) ? "date" : undefined}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative flex min-h-11 w-full flex-col items-center justify-center rounded-[var(--radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-elevated)]",
                !disabled && "cursor-pointer",
                !inMonth && "text-[var(--color-text-disabled)]",
                inMonth && "text-[var(--color-text-primary)]",
                isToday(day) && !isSelected && "bg-[var(--color-brand-primary)]/8 font-semibold text-[var(--color-brand-primary)]",
                isSelected && "bg-[var(--color-brand-primary)] text-white",
                !isSelected && !disabled && "hover:bg-[var(--color-surface-muted)]",
                disabled && "cursor-not-allowed opacity-30"
              )}
            >
              {format(day, "d")}
              {hasMark && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-brand-primary)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
