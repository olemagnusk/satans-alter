"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
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
import type { Concert } from "@/lib/validation/concert";

type ConcertTableProps = {
  concerts: Concert[];
};

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
          <span className="max-w-[80px] truncate sm:max-w-[120px]">{value || "All"}</span>
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
          All
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

export function ConcertTable({ concerts }: ConcertTableProps) {
  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [bandFilter, setBandFilter] = useState("");

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

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return concerts.filter((c) => {
      if (venueFilter && c.venue !== venueFilter) return false;
      if (bandFilter && c.band_name !== bandFilter) return false;
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
  }, [concerts, search, venueFilter, bandFilter]);

  if (!concerts.length) {
    return (
      <p className="text-sm text-coven-text-muted">
        No concerts yet. Use the New Concert page to add your first entry.
      </p>
    );
  }

  const hasActiveFilters = search || venueFilter || bandFilter;

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-coven-text-muted" />
          <Input
            placeholder="Search concerts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Venue"
            value={venueFilter}
            options={venues}
            onChange={setVenueFilter}
          />
          <FilterSelect
            label="Band"
            value={bandFilter}
            options={bands}
            onChange={setBandFilter}
          />
          {hasActiveFilters && (
            <button
              type="button"
              className="text-xs text-coven-text-muted transition hover:text-coven-text"
              onClick={() => {
                setSearch("");
                setVenueFilter("");
                setBandFilter("");
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <p className="text-xs text-coven-text-muted">
          {filtered.length} of {concerts.length} concerts
        </p>
      )}

      {/* Table */}
      <div className="-mx-4 overflow-x-auto sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Band</TableHeadCell>
                <TableHeadCell className="hidden sm:table-cell">Support</TableHeadCell>
                <TableHeadCell>Venue</TableHeadCell>
                <TableHeadCell className="hidden md:table-cell">Booker</TableHeadCell>
                <TableHeadCell className="hidden sm:table-cell">Main (P/D/K)</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell">Attendees</TableHeadCell>
                <TableHeadCell className="hidden xl:table-cell">Stand-ins</TableHeadCell>
                <TableHeadCell className="hidden xl:table-cell">Note</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-6 text-center text-coven-text-muted"
                  >
                    No concerts match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((concert) => (
                  <TableRow key={concert.id}>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                      {concert.date}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs sm:max-w-none sm:text-sm">
                      {concert.band_name}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      {[concert.support_band_1, concert.support_band_2]
                        .filter(Boolean)
                        .join(", ") || "–"}
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate text-xs sm:max-w-none sm:whitespace-nowrap sm:text-sm">
                      {concert.venue || "–"}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap md:table-cell">
                      {concert.booker || "–"}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      <span className="tabular-nums text-xs">
                        {[
                          concert.score_main_andreas,
                          concert.score_main_dennis,
                          concert.score_main_magnus,
                        ]
                          .map((v) => (v != null ? String(v) : "–"))
                          .join(" / ")}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {concert.attendees?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {concert.attendees.map((name) => (
                            <span
                              key={name}
                              className="inline-flex rounded-full bg-coven-primary/10 px-2 py-0.5 text-xs font-medium text-coven-primary"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "–"
                      )}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {concert.stand_ins?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {concert.stand_ins.map((name) => (
                            <span
                              key={name}
                              className="inline-flex rounded-full bg-coven-border px-2 py-0.5 text-xs font-medium text-coven-text-muted"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "–"
                      )}
                    </TableCell>
                    <TableCell className="hidden max-w-[150px] truncate xl:table-cell">
                      {concert.note || "–"}
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
