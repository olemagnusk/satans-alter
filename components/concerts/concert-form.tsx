"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, X } from "lucide-react";
import { concertInputSchema, type ConcertInput, type ConcertFormValues } from "@/lib/validation/concert";
import { createConcertAction } from "@/app/(dashboard)/concerts/new/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MEMBERS as MEMBER_LIST, toDbName } from "@/lib/members";
import { t } from "@/lib/i18n";
import { DatePicker, VenueSelect, GenreSelect, StandinsSelect } from "@/components/concerts/form-fields";

const MEMBERS = MEMBER_LIST.map((m) => m.nickname);

/* ── Local select components (booker + attendees are member-specific) ── */

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
            {value || t("form.select_booker")}
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
              {value.length ? `${value.length} ${t("form.selected")}` : t("form.select_attendees")}
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
      genre: "",
      note: ""
    }
  });

  async function onSubmit(values: ConcertInput) {
    setError(null);
    setLoading(true);

    const dbValues = {
      ...values,
      booker: values.booker ? toDbName(values.booker) : "",
      attendees: values.attendees?.map(toDbName) ?? [],
    };

    try {
      await createConcertAction(dbValues);
      router.push("/concerts");
    } catch {
      setError(t("form.save_error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="bandName">{t("form.band_name")}</Label>
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
          <Label>{t("form.date")}</Label>
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
          <Label htmlFor="supportBand1">{t("form.support_band_1")}</Label>
          <Input
            id="supportBand1"
            {...form.register("supportBand1")}
          />
        </div>
        <div className="space-y-1">
          <Label>{t("form.booker")}</Label>
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
          <Label>{t("form.attendees")}</Label>
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
          <Label>{t("form.standins")}</Label>
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
          <Label>{t("form.venue")}</Label>
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
        <div className="space-y-1">
          <Label>{t("form.genre")}</Label>
          <Controller
            control={form.control}
            name="genre"
            render={({ field }) => (
              <GenreSelect
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="note">{t("form.note")}</Label>
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
        {loading ? t("form.saving") : t("form.save_concert")}
      </Button>
    </form>
  );
}
