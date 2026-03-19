"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STORAGE_KEY = "satans-alter-next-concert-date";

function isDatePassed(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return target < today;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function NextConcert() {
  const [date, setDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !isDatePassed(stored)) {
      setDate(stored);
    } else {
      setDate(null);
    }
  }, []);

  function handleSelect(selected: Date | undefined) {
    if (!selected) return;
    const value = toDateString(selected);
    localStorage.setItem(STORAGE_KEY, value);
    setDate(value);
    setOpen(false);
  }

  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="py-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-coven-text-muted" />
            <span className="text-sm text-coven-text-muted">Loading…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const expired = date !== null && isDatePassed(date);
  const hasDate = date !== null && !expired;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = date ? new Date(date + "T00:00:00") : undefined;

  return (
    <Card className="w-full">
      <CardContent className="py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coven-primary/10">
            <CalendarDays className="h-4 w-4 text-coven-primary" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-coven-text-muted">
            Next concert
          </p>
        </div>
        <div className="mt-2">
          {hasDate ? (
            <p className="text-sm font-semibold text-coven-text">
              {formatDate(date)}
            </p>
          ) : (
            <p className="text-sm text-coven-text-muted">
              {expired ? "Concert has passed — pick a new date" : "No date set"}
            </p>
          )}
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="mt-2 w-fit rounded-lg border border-coven-border px-3 py-1.5 text-xs text-coven-text-muted transition hover:border-coven-primary hover:text-coven-text"
            >
              {hasDate ? "Change" : "Pick date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={{ before: today }}
              defaultMonth={selectedDate ?? today}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
