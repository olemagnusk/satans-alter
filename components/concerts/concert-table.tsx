"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronUp, ChevronDown, List, Rows3, SlidersHorizontal, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MEMBERS, displayName } from "@/lib/members";
import { t } from "@/lib/i18n";
import { EditConcertDialog } from "@/components/concerts/edit-concert-dialog";
import type { Concert } from "@/lib/validation/concert";

type ConcertTableProps = {
  concerts: Concert[];
};

type SortColumn =
  | "date"
  | "band"
  | "support"
  | "venue"
  | "booker"
  | "main"
  | "support_score"
  | "attendees"
  | "standins"
  | "note";

type SortDirection = "asc" | "desc";

type ColumnKey = SortColumn;

const ALL_COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: "date", label: t("col.date") },
  { key: "band", label: t("col.band") },
  { key: "support", label: t("col.support") },
  { key: "venue", label: t("col.venue") },
  { key: "booker", label: t("col.booker") },
  { key: "main", label: t("col.main") },
  { key: "support_score", label: t("col.support_score") },
  { key: "attendees", label: t("col.attendees") },
  { key: "standins", label: t("col.standins") },
  { key: "note", label: t("col.note") },
];

const DEFAULT_VISIBLE: Set<ColumnKey> = new Set([
  "date",
  "band",
  "support",
  "venue",
  "booker",
  "main",
  "support_score",
  "attendees",
  "standins",
  "note",
]);

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function avgScores(scores: (number | null)[]): number {
  const valid = scores.filter((v): v is number => v != null);
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text transition hover:border-coven-primary"
        >
          <span className="text-coven-text-muted">{label}:</span>
          <span className="max-w-[80px] truncate sm:max-w-[120px]">{value || t("table.all")}</span>
          {value && (
            <X
              className="ml-1 h-3 w-3 shrink-0 text-coven-text-muted hover:text-coven-text"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setOpen(false);
              }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-60 w-48 overflow-y-auto p-1"
        align="start"
      >
        <button
          type="button"
          className="w-full rounded-md px-2 py-1.5 text-left text-sm text-coven-text-muted hover:bg-coven-active"
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
        >
          {t("table.all")}
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
              value === opt
                ? "bg-coven-primary/10 text-coven-primary"
                : "text-coven-text"
            }`}
            onClick={() => {
              onChange(opt);
              setOpen(false);
            }}
          >
            {opt}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function SortableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: {
  label: string;
  column: SortColumn;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  onSort: (col: SortColumn) => void;
  className?: string;
}) {
  const active = sortColumn === column;
  return (
    <TableHeadCell className={className}>
      <button
        type="button"
        className="inline-flex items-center gap-1 transition hover:text-coven-text"
        onClick={() => onSort(column)}
      >
        {label}
        {active ? (
          sortDirection === "asc" ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ChevronUp className="h-3.5 w-3.5 opacity-0 group-hover:opacity-30" />
        )}
      </button>
    </TableHeadCell>
  );
}

function ScoreDisplay({
  scores,
  expanded,
}: {
  scores: { initial: string; nickname: string; value: number | null }[];
  expanded: boolean;
}) {
  if (expanded) {
    return (
      <div className="space-y-0.5">
        {scores.map((s) => (
          <div key={s.initial} className="flex items-center gap-1.5 text-xs">
            <span className="w-10 text-coven-text-muted">{s.nickname}</span>
            <span className="tabular-nums text-coven-text">
              {s.value != null ? s.value : "–"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="tabular-nums text-xs">
      {scores
        .map((s) => `${s.initial}:${s.value != null ? s.value : "–"}`)
        .join("  ")}
    </span>
  );
}

export function ConcertTable({ concerts }: ConcertTableProps) {
  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [bandFilter, setBandFilter] = useState("");
  const [bookerFilter, setBookerFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expanded, setExpanded] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    () => new Set(DEFAULT_VISIBLE)
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setIsScrolled(scrollRef.current.scrollLeft > 0);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function toggleColumn(key: ColumnKey) {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const isVisible = (key: ColumnKey) => visibleColumns.has(key);

  const venues = useMemo(
    () =>
      Array.from(
        new Set(concerts.map((c) => c.venue).filter(Boolean) as string[])
      ).sort(),
    [concerts]
  );

  const bands = useMemo(
    () => Array.from(new Set(concerts.map((c) => c.band_name))).sort(),
    [concerts]
  );

  const bookers = useMemo(
    () =>
      Array.from(
        new Set(concerts.map((c) => c.booker).filter(Boolean) as string[])
      )
        .map(displayName)
        .sort(),
    [concerts]
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(concerts.map((c) => c.date.slice(0, 4)))
      ).sort((a, b) => b.localeCompare(a)),
    [concerts]
  );

  function handleSort(col: SortColumn) {
    if (sortColumn === col) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return concerts.filter((c) => {
      if (venueFilter && c.venue !== venueFilter) return false;
      if (bandFilter && c.band_name !== bandFilter) return false;
      if (bookerFilter && displayName(c.booker ?? "") !== bookerFilter)
        return false;
      if (yearFilter && !c.date.startsWith(yearFilter)) return false;
      if (q) {
        const haystack = [
          c.band_name,
          c.support_band_1,
          c.support_band_2,
          c.venue,
          c.booker,
          c.date,
          c.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [concerts, search, venueFilter, bandFilter, bookerFilter, yearFilter]);

  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;

    return [...filtered].sort((a, b) => {
      let cmp = 0;

      switch (sortColumn) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "band":
          cmp = a.band_name.localeCompare(b.band_name);
          break;
        case "support":
          cmp = (a.support_band_1 ?? "").localeCompare(
            b.support_band_1 ?? ""
          );
          break;
        case "venue":
          cmp = (a.venue ?? "").localeCompare(b.venue ?? "");
          break;
        case "booker":
          cmp = (a.booker ?? "").localeCompare(b.booker ?? "");
          break;
        case "main":
          cmp =
            avgScores([
              a.score_main_andreas,
              a.score_main_dennis,
              a.score_main_magnus,
            ]) -
            avgScores([
              b.score_main_andreas,
              b.score_main_dennis,
              b.score_main_magnus,
            ]);
          break;
        case "support_score":
          cmp =
            avgScores([
              a.score_support_andreas,
              a.score_support_dennis,
              a.score_support_magnus,
            ]) -
            avgScores([
              b.score_support_andreas,
              b.score_support_dennis,
              b.score_support_magnus,
            ]);
          break;
        case "attendees":
          cmp = (a.attendees?.length ?? 0) - (b.attendees?.length ?? 0);
          break;
        case "standins":
          cmp = (a.stand_ins?.length ?? 0) - (b.stand_ins?.length ?? 0);
          break;
        case "note":
          cmp = (a.note ?? "").localeCompare(b.note ?? "");
          break;
      }

      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortColumn, sortDirection]);

  if (!concerts.length) {
    return (
      <p className="text-sm text-coven-text-muted">
        {t("table.no_concerts")}
      </p>
    );
  }

  const hasActiveFilters = search || venueFilter || bandFilter || bookerFilter || yearFilter;

  const memberScores = (concert: Concert, type: "main" | "support") => {
    const prefix = type === "main" ? "score_main_" : "score_support_";
    return MEMBERS.map((m) => ({
      initial: m.initial,
      nickname: m.nickname,
      value: concert[`${prefix}${m.dbName.toLowerCase()}` as keyof Concert] as
        | number
        | null,
    }));
  };

  const stickyBandShadow = isScrolled
    ? "after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-2 after:translate-x-full after:bg-gradient-to-r after:from-coven-bg/40 after:to-transparent after:content-['']"
    : "";

  return (
    <div className="space-y-3">
      {/* Filters & controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-coven-text-muted" />
            <Input
              placeholder={t("table.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Column picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                title={t("table.toggle_columns")}
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-coven-border bg-transparent px-2.5 text-sm text-coven-text-muted transition hover:border-coven-primary hover:text-coven-text"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{t("table.columns")}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="end">
              {ALL_COLUMNS.map((col) => {
                const checked = isVisible(col.key);
                return (
                  <button
                    key={col.key}
                    type="button"
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
                      checked ? "text-coven-text" : "text-coven-text-muted"
                    }`}
                    onClick={() => toggleColumn(col.key)}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? "border-coven-primary bg-coven-primary text-white"
                          : "border-coven-border"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </span>
                    {col.label}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* View toggle */}
          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-coven-border p-0.5">
            <button
              type="button"
              title={t("table.condensed_view")}
              className={`rounded-md p-1.5 transition ${
                !expanded
                  ? "bg-coven-active text-coven-text"
                  : "text-coven-text-muted hover:text-coven-text"
              }`}
              onClick={() => setExpanded(false)}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              title={t("table.expanded_view")}
              className={`rounded-md p-1.5 transition ${
                expanded
                  ? "bg-coven-active text-coven-text"
                  : "text-coven-text-muted hover:text-coven-text"
              }`}
              onClick={() => setExpanded(true)}
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label={t("col.venue")}
            value={venueFilter}
            options={venues}
            onChange={setVenueFilter}
          />
          <FilterSelect
            label={t("col.band")}
            value={bandFilter}
            options={bands}
            onChange={setBandFilter}
          />
          <FilterSelect
            label={t("col.booker")}
            value={bookerFilter}
            options={bookers}
            onChange={setBookerFilter}
          />
          <FilterSelect
            label={t("col.year")}
            value={yearFilter}
            options={years}
            onChange={setYearFilter}
          />
          {hasActiveFilters && (
            <button
              type="button"
              className="text-xs text-coven-text-muted transition hover:text-coven-text"
              onClick={() => {
                setSearch("");
                setVenueFilter("");
                setBandFilter("");
                setBookerFilter("");
                setYearFilter("");
              }}
            >
              {t("table.clear_all")}
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p className="text-xs text-coven-text-muted">
          {filtered.length} {t("table.of")} {concerts.length} {t("table.concerts")}
        </p>
      )}

      {/* Table */}
      <div ref={scrollRef} className="-mx-4 overflow-x-auto sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <TableHead>
              <TableRow>
                {ALL_COLUMNS.filter((c) => isVisible(c.key)).map((col) => (
                  <SortableHeader
                    key={col.key}
                    label={col.label}
                    column={col.key}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className={col.key === "band" ? `sticky left-0 z-10 bg-coven-surface ${stickyBandShadow}` : undefined}
                  />
                ))}
                <TableHeadCell className="w-8" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.size}
                    className="py-6 text-center text-coven-text-muted"
                  >
                    {t("table.no_match")}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((concert) => (
                  <TableRow key={concert.id}>
                    {isVisible("date") && (
                      <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                        {formatDate(concert.date)}
                      </TableCell>
                    )}
                    {isVisible("band") && (
                      <TableCell className={`sticky left-0 z-10 max-w-[120px] truncate bg-coven-surface text-xs font-semibold sm:max-w-none sm:text-sm ${stickyBandShadow}`}>
                        {concert.band_name}
                      </TableCell>
                    )}
                    {isVisible("support") && (
                      <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                        {[concert.support_band_1, concert.support_band_2]
                          .filter(Boolean)
                          .join(", ") || "–"}
                      </TableCell>
                    )}
                    {isVisible("venue") && (
                      <TableCell className="max-w-[100px] truncate text-xs sm:max-w-none sm:whitespace-nowrap sm:text-sm">
                        {concert.venue || "–"}
                      </TableCell>
                    )}
                    {isVisible("booker") && (
                      <TableCell className="whitespace-nowrap">
                        {concert.booker ? displayName(concert.booker) : "–"}
                      </TableCell>
                    )}
                    {isVisible("main") && (
                      <TableCell>
                        <ScoreDisplay
                          scores={memberScores(concert, "main")}
                          expanded={expanded}
                        />
                      </TableCell>
                    )}
                    {isVisible("support_score") && (
                      <TableCell>
                        <ScoreDisplay
                          scores={memberScores(concert, "support")}
                          expanded={expanded}
                        />
                      </TableCell>
                    )}
                    {isVisible("attendees") && (
                      <TableCell>
                        {concert.attendees?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {concert.attendees.map((name) => (
                              <span
                                key={name}
                                className="inline-flex rounded-full bg-coven-primary/10 px-2 py-0.5 text-xs font-medium text-coven-primary"
                              >
                                {displayName(name)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "–"
                        )}
                      </TableCell>
                    )}
                    {isVisible("standins") && (
                      <TableCell>
                        {concert.stand_ins?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {concert.stand_ins.map((name) => (
                              <span
                                key={name}
                                className="inline-flex rounded-full bg-coven-border px-2 py-0.5 text-xs font-medium text-coven-text-soft"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "–"
                        )}
                      </TableCell>
                    )}
                    {isVisible("note") && (
                      <TableCell className="max-w-[150px] truncate">
                        {concert.note || "–"}
                      </TableCell>
                    )}
                    <TableCell className="w-8 px-1">
                      <EditConcertDialog concert={concert} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
