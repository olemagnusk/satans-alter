"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { t } from "@/lib/i18n";

/* ── Constants & localStorage helpers ── */

export const DEFAULT_VENUES = [
  "John Dee",
  "Rockefeller",
  "Revolver",
  "Goldie",
  "Sentrum Scene",
  "Vaterland",
  "Brewgata",
  "Parkteateret",
];

const VENUES_STORAGE_KEY = "satans-alter-custom-venues";
const STANDINS_STORAGE_KEY = "satans-alter-standins";

export function getStoredVenues(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENUES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomVenue(venue: string) {
  const custom = getStoredVenues();
  if (!custom.includes(venue)) {
    localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify([...custom, venue]));
  }
}

export function getStoredStandins(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STANDINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStandins(standins: string[]) {
  try {
    localStorage.setItem(STANDINS_STORAGE_KEY, JSON.stringify(standins));
  } catch {
    // ignore
  }
}

/* ── Date helpers ── */

export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ── DatePicker ── */

export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
        >
          <span className={value ? "text-coven-text" : "text-coven-text-muted"}>
            {value ? formatDateDisplay(value) : t("form.pick_date")}
          </span>
          <CalendarDays className="h-4 w-4 text-coven-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(toDateString(d));
              setOpen(false);
            }
          }}
          defaultMonth={selected ?? new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ── VenueSelect ── */

export function VenueSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVenue, setNewVenue] = useState("");
  const [customVenues, setCustomVenues] = useState<string[]>([]);

  useEffect(() => {
    setCustomVenues(getStoredVenues());
  }, []);

  const allVenues = [...DEFAULT_VENUES, ...customVenues].sort();

  function handleAddVenue() {
    const trimmed = newVenue.trim();
    if (!trimmed) return;
    if (!allVenues.includes(trimmed)) {
      saveCustomVenue(trimmed);
      setCustomVenues((prev) => [...prev, trimmed]);
    }
    onChange(trimmed);
    setNewVenue("");
    setAdding(false);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setAdding(false); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
        >
          <span className={value ? "text-coven-text" : "text-coven-text-muted"}>
            {value || t("form.select_venue")}
          </span>
          <ChevronDown className="h-4 w-4 text-coven-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-72 w-[var(--radix-popover-trigger-width)] overflow-y-auto p-1" align="start">
        {adding ? (
          <div className="flex items-center gap-1 p-1">
            <Input
              autoFocus
              placeholder={t("form.venue_name")}
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddVenue();
                }
                if (e.key === "Escape") {
                  setAdding(false);
                }
              }}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              onClick={handleAddVenue}
              className="h-8 shrink-0 px-2 text-xs"
            >
              {t("form.add")}
            </Button>
          </div>
        ) : (
          <>
            {allVenues.map((venue) => (
              <button
                key={venue}
                type="button"
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
                  value === venue ? "bg-coven-primary/10 text-coven-primary" : "text-coven-text"
                }`}
                onClick={() => {
                  onChange(venue);
                  setOpen(false);
                }}
              >
                {value === venue && <Check className="h-3.5 w-3.5" />}
                {venue}
              </button>
            ))}
            <div className="mt-1 border-t border-coven-border pt-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-coven-text-muted transition hover:bg-coven-active hover:text-coven-text"
                onClick={() => setAdding(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("form.add_new_venue")}
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── GenreSelect ── */

export const DEFAULT_GENRES = [
  "Black Metal",
  "Classic Rock",
  "Country",
  "Death Metal",
  "Doom Metal",
  "Hard Rock",
  "Hardcore Punk",
  "Indie Rock",
  "Progressive Death Metal",
  "Progressive Rock",
  "Punk Rock",
  "Rock",
  "Sludge Metal",
  "Southern Rock",
  "Stoner Rock",
  "Thrash Metal",
];

const GENRES_STORAGE_KEY = "satans-alter-custom-genres";

function getStoredGenres(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GENRES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomGenre(genre: string) {
  const custom = getStoredGenres();
  if (!custom.includes(genre)) {
    localStorage.setItem(GENRES_STORAGE_KEY, JSON.stringify([...custom, genre]));
  }
}

export function GenreSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [customGenres, setCustomGenres] = useState<string[]>([]);

  useEffect(() => {
    setCustomGenres(getStoredGenres());
  }, []);

  const allGenres = Array.from(new Set([...DEFAULT_GENRES, ...customGenres])).sort();

  function handleAddGenre() {
    const trimmed = newGenre.trim();
    if (!trimmed) return;
    if (!allGenres.includes(trimmed)) {
      saveCustomGenre(trimmed);
      setCustomGenres((prev) => [...prev, trimmed]);
    }
    onChange(trimmed);
    setNewGenre("");
    setAdding(false);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setAdding(false); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
        >
          <span className={value ? "text-coven-text" : "text-coven-text-muted"}>
            {value || t("form.select_genre")}
          </span>
          <ChevronDown className="h-4 w-4 text-coven-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-72 w-[var(--radix-popover-trigger-width)] overflow-y-auto p-1" align="start">
        {adding ? (
          <div className="flex items-center gap-1 p-1">
            <Input
              autoFocus
              placeholder={t("form.genre_name")}
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddGenre();
                }
                if (e.key === "Escape") {
                  setAdding(false);
                }
              }}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              onClick={handleAddGenre}
              className="h-8 shrink-0 px-2 text-xs"
            >
              {t("form.add")}
            </Button>
          </div>
        ) : (
          <>
            {allGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
                  value === genre ? "bg-coven-primary/10 text-coven-primary" : "text-coven-text"
                }`}
                onClick={() => {
                  onChange(genre);
                  setOpen(false);
                }}
              >
                {value === genre && <Check className="h-3.5 w-3.5" />}
                {genre}
              </button>
            ))}
            <div className="mt-1 border-t border-coven-border pt-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-coven-text-muted transition hover:bg-coven-active hover:text-coven-text"
                onClick={() => setAdding(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("form.add_new_genre")}
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── StandinsSelect ── */

export function StandinsSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [newStandin, setNewStandin] = useState("");
  const [knownStandins, setKnownStandins] = useState<string[]>([]);

  useEffect(() => {
    setKnownStandins(getStoredStandins());
  }, []);

  function toggle(name: string) {
    if (value.includes(name)) {
      const updated = value.filter((v) => v !== name);
      onChange(updated);
      saveStandins(Array.from(new Set([...knownStandins, ...updated])));
    } else {
      const updated = [...value, name];
      onChange(updated);
      const updatedKnown = Array.from(new Set([...knownStandins, name]));
      setKnownStandins(updatedKnown);
      saveStandins(updatedKnown);
    }
  }

  function addNew() {
    const trimmed = newStandin.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      const updated = [...value, trimmed];
      onChange(updated);
      const updatedKnown = Array.from(new Set([...knownStandins, trimmed]));
      setKnownStandins(updatedKnown);
      saveStandins(updatedKnown);
    }
    setNewStandin("");
  }

  const options = Array.from(new Set([...knownStandins, ...value])).sort();

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
          >
            <span className={value.length ? "text-coven-text" : "text-coven-text-muted"}>
              {value.length ? `${value.length} ${t("form.standins_count")}` : t("form.select_standins")}
            </span>
            <ChevronDown className="h-4 w-4 text-coven-text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] space-y-2 p-2" align="start">
          <div className="flex items-center gap-1">
            <Input
              placeholder={t("form.add_standin")}
              value={newStandin}
              onChange={(e) => setNewStandin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNew();
                }
              }}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              size="icon"
              className="h-8 w-8"
              onClick={addNew}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {options.map((name) => {
              const selected = value.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
                    selected ? "bg-coven-primary/10 text-coven-primary" : "text-coven-text"
                  }`}
                  onClick={() => toggle(name)}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      selected
                        ? "border-coven-primary bg-coven-primary text-white"
                        : "border-coven-border"
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  {name}
                </button>
              );
            })}
            {options.length === 0 && (
              <p className="px-1 text-xs text-coven-text-muted">
                {t("form.no_standins")}
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-coven-primary/10 px-2 py-0.5 text-xs font-medium text-coven-primary"
            >
              {name}
              <button
                type="button"
                onClick={() => toggle(name)}
                className="hover:text-coven-text"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
