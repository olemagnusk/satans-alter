"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Check, ChevronDown, Plus, X } from "lucide-react";
import { concertInputSchema, type ConcertInput, type ConcertFormValues } from "@/lib/validation/concert";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MEMBERS = ["Andreas", "Dennis", "Magnus"] as const;

const DEFAULT_VENUES = [
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

function getStoredVenues(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENUES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomVenue(venue: string) {
  const custom = getStoredVenues();
  if (!custom.includes(venue)) {
    localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify([...custom, venue]));
  }
}

function getStoredStandins(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STANDINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStandins(standins: string[]) {
  try {
    localStorage.setItem(STANDINS_STORAGE_KEY, JSON.stringify(standins));
  } catch {
    // ignore
  }
}

function formatDateDisplay(dateStr: string): string {
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

/* ── Reusable select components ── */

function SingleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
        >
          <span className={value ? "text-coven-text" : "text-coven-text-muted"}>
            {value || "Select booker…"}
          </span>
          <ChevronDown className="h-4 w-4 text-coven-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
        {MEMBERS.map((name) => (
          <button
            key={name}
            type="button"
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition hover:bg-coven-active ${
              value === name ? "bg-coven-primary/10 text-coven-primary" : "text-coven-text"
            }`}
            onClick={() => {
              onChange(name);
              setOpen(false);
            }}
          >
            {value === name && <Check className="h-3.5 w-3.5" />}
            {name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function MultiSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  function toggle(name: string) {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  }

  return (
    <div className="space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-lg border border-coven-border bg-transparent px-3 text-sm text-coven-text shadow-sm transition-colors hover:border-coven-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coven-primary focus-visible:ring-offset-2 focus-visible:ring-offset-coven-bg"
          >
            <span className={value.length ? "text-coven-text" : "text-coven-text-muted"}>
              {value.length ? `${value.length} selected` : "Select attendees…"}
            </span>
            <ChevronDown className="h-4 w-4 text-coven-text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
          {MEMBERS.map((name) => {
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
                onClick={() => onChange(value.filter((v) => v !== name))}
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

function StandinsSelect({
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
              {value.length ? `${value.length} stand-ins` : "Select stand-ins…"}
            </span>
            <ChevronDown className="h-4 w-4 text-coven-text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] space-y-2 p-2" align="start">
          <div className="flex items-center gap-1">
            <Input
              placeholder="Add stand-in…"
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
                No stand-ins yet. Add one above.
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

function DatePicker({
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
            {value ? formatDateDisplay(value) : "Pick a date…"}
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

function VenueSelect({
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
            {value || "Select venue…"}
          </span>
          <ChevronDown className="h-4 w-4 text-coven-text-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-72 w-[var(--radix-popover-trigger-width)] overflow-y-auto p-1" align="start">
        {adding ? (
          <div className="flex items-center gap-1 p-1">
            <Input
              autoFocus
              placeholder="Venue name…"
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
              Add
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
                Add new venue
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ── Main form ── */

export function ConcertForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ConcertFormValues, unknown, ConcertInput>({
    resolver: zodResolver(concertInputSchema),
    defaultValues: {
      bandName: "",
      supportBand1: "",
      supportBand2: "",
      booker: "",
      attendees: [],
      standIns: [],
      date: "",
      venue: "",
      note: ""
    }
  });

  async function onSubmit(values: ConcertInput) {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const { error: rpcError } = await supabase.functions.invoke(
      "create-concert",
      {
        body: {
          concert: values
        }
      }
    );

    setLoading(false);

    if (rpcError) {
      setError("Something went wrong while saving. Please try again.");
      return;
    }

    router.push("/concerts");
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="bandName">Band name</Label>
          <Input
            id="bandName"
            {...form.register("bandName")}
          />
          {form.formState.errors.bandName && (
            <p className="text-xs text-coven-danger">
              {form.formState.errors.bandName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label>Date</Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <DatePicker
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
          {form.formState.errors.date && (
            <p className="text-xs text-coven-danger">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="supportBand1">Support band 1</Label>
          <Input
            id="supportBand1"
            {...form.register("supportBand1")}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="supportBand2">Support band 2</Label>
          <Input
            id="supportBand2"
            {...form.register("supportBand2")}
          />
        </div>
        <div className="space-y-1">
          <Label>Booker</Label>
          <Controller
            control={form.control}
            name="booker"
            render={({ field }) => (
              <SingleSelect
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <Label>Attendees</Label>
          <Controller
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <MultiSelect
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <Label>Stand-ins</Label>
          <Controller
            control={form.control}
            name="standIns"
            render={({ field }) => (
              <StandinsSelect
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="space-y-1">
          <Label>Venue</Label>
          <Controller
            control={form.control}
            name="venue"
            render={({ field }) => (
              <VenueSelect
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          {...form.register("note")}
        />
      </div>
      {error && <p className="text-xs text-coven-danger">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save concert"}
      </Button>
    </form>
  );
}
