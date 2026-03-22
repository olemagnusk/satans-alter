"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ScoreOverTimePoint } from "@/lib/stats/concerts";

type Props = {
  data: ScoreOverTimePoint[];
};

/* Coven-aligned year palette — warm stone tones with subtle differentiation */
const YEAR_COLORS: Record<number, string> = {
  2023: "#8B7E6A",  /* warm taupe */
  2024: "#B1A79A",  /* coven-primary */
  2025: "#C4A882",  /* warm sand */
  2026: "#A89279",  /* amber stone */
  2027: "#9A8E7A",  /* muted khaki */
  2028: "#BFA98E",  /* dusty gold */
};

function getColor(year: number): string {
  return YEAR_COLORS[year] ?? "#6B6B6B";
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
  return `${parseInt(d, 10)}. ${months[parseInt(m, 10) - 1]} ${y}`;
}

export function ScoreChart({ data }: Props) {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => [...new Set(data.map((d) => d.year))].sort(), [data]);
  const [activeYear, setActiveYear] = useState<number>(currentYear);
  const activeYears = useMemo(() => new Set([activeYear]), [activeYear]);
  const [selectedPoint, setSelectedPoint] = useState<ScoreOverTimePoint | null>(null);

  /* Build per-year data arrays and a combined dataset for the area chart.
     We normalize dates to day-of-year so multiple years overlay on the same Jan-Dec axis. */
  const { chartData, chartConfig, activeYearList } = useMemo(() => {
    const filtered = data.filter((d) => activeYears.has(d.year));
    const activeList = [...activeYears].sort();

    // Collect all unique dayOfYear values across active years
    const allDays = new Set<number>();
    const yearPoints = new Map<number, Map<number, { score: number; date: string; band: string }>>();

    for (const d of filtered) {
      const dt = new Date(d.date + "T12:00:00");
      const jan1 = new Date(dt.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((dt.getTime() - jan1.getTime()) / 86400000);
      allDays.add(dayOfYear);

      if (!yearPoints.has(d.year)) yearPoints.set(d.year, new Map());
      yearPoints.get(d.year)!.set(dayOfYear, { score: d.avgScore, date: d.date, band: d.band });
    }

    // Build combined rows — every day that has any data gets a row with all year columns
    const sortedDays = [...allDays].sort((a, b) => a - b);
    const rows: Array<Record<string, number | string | undefined>> = sortedDays.map((day) => {
      const row: Record<string, number | string | undefined> = { dayOfYear: day };
      // Pick any available date/band for tooltip
      for (const year of activeList) {
        const pt = yearPoints.get(year)?.get(day);
        if (pt) {
          row[`y${year}`] = pt.score;
          if (!row.date) {
            row.date = pt.date;
            row.band = pt.band;
          }
        }
      }
      return row;
    });

    // Build chart config for each active year
    const config: ChartConfig = {};
    for (const year of activeList) {
      config[`y${year}`] = {
        label: String(year),
        color: getColor(year),
      };
    }

    return { chartData: rows, chartConfig: config, activeYearList: activeList };
  }, [data, activeYears]);

  return (
    <div className="space-y-4">
      {/* Year toggles */}
      <div className="flex flex-wrap gap-2">
        {years.map((year) => {
          const active = activeYears.has(year);
          const color = getColor(year);
          return (
            <button
              key={year}
              type="button"
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? "border-transparent text-coven-bg"
                  : "border-coven-border text-coven-text-muted hover:border-coven-text-muted"
              }`}
              style={active ? { backgroundColor: color } : undefined}
              onClick={() => setActiveYear(year)}
            >
              {year}
            </button>
          );
        })}
      </div>

      {/* Area chart */}
      {chartData.length === 0 ? (
        <p className="py-8 text-center text-sm text-coven-text-muted">
          Velg et år for å se score over tid.
        </p>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
          >
            <defs>
              {activeYearList.map((year) => (
                <linearGradient
                  key={year}
                  id={`fill-${year}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-y${year})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-y${year})`}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--coven-grid)"
            />
            <XAxis
              dataKey="dayOfYear"
              type="number"
              domain={[1, 365]}
              ticks={[1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(day: number) => {
                const months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
                // Approximate month from day of year
                const monthStarts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
                let idx = 0;
                for (let i = monthStarts.length - 1; i >= 0; i--) {
                  if (day >= monthStarts[i]) { idx = i; break; }
                }
                return months[idx];
              }}
            />
            <YAxis
              domain={[1, 6]}
              ticks={[1, 2, 3, 4, 5, 6]}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="border-coven-border bg-coven-surface text-coven-text"
                  labelFormatter={(_: unknown, payload: Array<{ payload?: Record<string, string> }>) => {
                    const point = payload?.[0]?.payload;
                    if (!point) return "";
                    return (
                      <div>
                        <div className="font-semibold text-coven-text">{point.band}</div>
                        <div className="text-coven-text-muted">{formatDate(point.date)}</div>
                      </div>
                    );
                  }}
                  formatter={(value: number, name: string) => {
                    const year = String(name).replace("y", "");
                    return (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: getColor(Number(year)) }}
                        />
                        <span className="text-coven-text-muted">{year}</span>
                        <span className="ml-auto font-mono font-semibold text-coven-primary">
                          {Number(value).toFixed(1)}
                        </span>
                      </div>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            {activeYearList.map((year) => (
              <Area
                key={year}
                dataKey={`y${year}`}
                type="natural"
                fill={`url(#fill-${year})`}
                stroke={`var(--color-y${year})`}
                strokeWidth={2}
                dot={{
                  fill: `var(--color-y${year})`,
                  stroke: "var(--coven-surface)",
                  strokeWidth: 2,
                  r: 4,
                  cursor: "pointer",
                }}
                activeDot={{
                  r: 6,
                  stroke: `var(--color-y${year})`,
                  strokeWidth: 2,
                  fill: "var(--coven-surface)",
                  cursor: "pointer",
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick: (_: any, payload: any) => {
                    if (payload?.payload) setSelectedPoint(payload.payload);
                  },
                }}
                connectNulls
              />
            ))}
          </AreaChart>
        </ChartContainer>
      )}

      {/* Detail modal */}
      <Dialog open={!!selectedPoint} onOpenChange={(v) => { if (!v) setSelectedPoint(null); }}>
        <DialogContent className="max-w-xs bg-coven-surface text-coven-text">
          <DialogHeader>
            <DialogTitle>{selectedPoint?.band}</DialogTitle>
          </DialogHeader>
          {selectedPoint && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-coven-text-muted">Dato</span>
                <span>{formatDate(selectedPoint.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-coven-text-muted">Snitt score</span>
                <span className="font-bold text-coven-primary">{selectedPoint.avgScore.toFixed(1)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
