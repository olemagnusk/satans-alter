"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center text-sm font-medium text-coven-text",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-coven-border bg-transparent text-coven-text-muted hover:bg-coven-active hover:text-coven-text transition-colors",
        button_next: "absolute right-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-coven-border bg-transparent text-coven-text-muted hover:bg-coven-active hover:text-coven-text transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-[0.8rem] font-normal text-coven-text-muted",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-coven-primary/10 [&:has([aria-selected].day-outside)]:bg-coven-primary/5 rounded-md",
        day_button: "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-normal transition-colors hover:bg-coven-active hover:text-coven-text focus:outline-none focus:ring-1 focus:ring-coven-primary aria-selected:bg-coven-primary aria-selected:text-white aria-selected:hover:bg-coven-primary-hover",
        selected: "bg-coven-primary text-white",
        today: "bg-coven-active font-semibold",
        outside: "text-coven-text-muted/50 aria-selected:bg-coven-primary/30 aria-selected:text-coven-text-muted",
        disabled: "text-coven-text-muted/30 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
