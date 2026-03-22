"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { t } from "@/lib/i18n";
import { setNextConcertDateAction } from "@/app/(dashboard)/dashboard/actions";

function isToday(dateStr: string): boolean {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return dateStr === `${y}-${m}-${d}`;
}

function isDatePassed(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return target < today;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", {
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

export function NextConcert({ initialDate }: { initialDate: string | null }) {
  const validInitial = initialDate && !isDatePassed(initialDate) ? initialDate : null;
  const [date, setDate] = useState<string | null>(validInitial);
  const [open, setOpen] = useState(false);

  async function handleSelect(selected: Date | undefined) {
    if (!selected) return;
    const value = toDateString(selected);
    setDate(value);
    setOpen(false);
    await setNextConcertDateAction(value);
  }

  const expired = date !== null && isDatePassed(date);
  const todayIsTheDay = date !== null && isToday(date);
  const hasDate = date !== null && !expired;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = date ? new Date(date + "T00:00:00") : undefined;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{t("next_concert.title")}</CardTitle>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-fit rounded-lg border border-coven-border px-3 py-1.5 text-xs text-coven-text-muted transition hover:border-coven-primary hover:text-coven-text"
            >
              {hasDate ? t("next_concert.change") : t("next_concert.pick_date")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={{ before: today }}
              defaultMonth={selectedDate ?? today}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        {todayIsTheDay ? (
          <p className="text-lg font-bold text-coven-text">
            {t("next_concert.today_message")}
          </p>
        ) : hasDate ? (
          <p className="text-2xl font-semibold text-coven-text">
            {formatDate(date)}
          </p>
        ) : (
          <p className="text-sm text-coven-text-muted">
            {expired ? t("next_concert.passed") : t("next_concert.no_date")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
