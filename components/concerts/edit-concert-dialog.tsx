"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEMBERS as MEMBER_LIST, displayName, toDbName } from "@/lib/members";
import { updateConcertAction } from "@/app/(dashboard)/concerts/new/actions";
import { t } from "@/lib/i18n";
import type { Concert } from "@/lib/validation/concert";

type Props = {
  concert: Concert;
};

function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-xs text-coven-text-muted">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            type="button"
            className={`flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition ${
              value === n
                ? "bg-coven-primary text-white"
                : "bg-coven-active text-coven-text-muted hover:bg-coven-border hover:text-coven-text"
            }`}
            onClick={() => onChange(value === n ? null : n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EditConcertDialog({ concert }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [bandName, setBandName] = useState(concert.band_name);
  const [supportBand1, setSupportBand1] = useState(concert.support_band_1 ?? "");
  const [supportBand2, setSupportBand2] = useState(concert.support_band_2 ?? "");
  const [booker, setBooker] = useState(concert.booker ? displayName(concert.booker) : "");
  const [venue, setVenue] = useState(concert.venue ?? "");
  const [date, setDate] = useState(concert.date);
  const [note, setNote] = useState(concert.note ?? "");
  const [attendees, setAttendees] = useState<string[]>(
    concert.attendees?.map(displayName) ?? []
  );
  const [standIns, setStandIns] = useState<string[]>(concert.stand_ins ?? []);

  // Scores
  const [scoreMainAndreas, setScoreMainAndreas] = useState<number | null>(concert.score_main_andreas);
  const [scoreMainDennis, setScoreMainDennis] = useState<number | null>(concert.score_main_dennis);
  const [scoreMainMagnus, setScoreMainMagnus] = useState<number | null>(concert.score_main_magnus);
  const [scoreSupportAndreas, setScoreSupportAndreas] = useState<number | null>(concert.score_support_andreas);
  const [scoreSupportDennis, setScoreSupportDennis] = useState<number | null>(concert.score_support_dennis);
  const [scoreSupportMagnus, setScoreSupportMagnus] = useState<number | null>(concert.score_support_magnus);

  function resetForm() {
    setBandName(concert.band_name);
    setSupportBand1(concert.support_band_1 ?? "");
    setSupportBand2(concert.support_band_2 ?? "");
    setBooker(concert.booker ? displayName(concert.booker) : "");
    setVenue(concert.venue ?? "");
    setDate(concert.date);
    setNote(concert.note ?? "");
    setAttendees(concert.attendees?.map(displayName) ?? []);
    setStandIns(concert.stand_ins ?? []);
    setScoreMainAndreas(concert.score_main_andreas);
    setScoreMainDennis(concert.score_main_dennis);
    setScoreMainMagnus(concert.score_main_magnus);
    setScoreSupportAndreas(concert.score_support_andreas);
    setScoreSupportDennis(concert.score_support_dennis);
    setScoreSupportMagnus(concert.score_support_magnus);
    setError(null);
  }

  async function handleSave() {
    if (!bandName.trim() || !date) return;
    setLoading(true);
    setError(null);

    try {
      await updateConcertAction(concert.id, {
        bandName,
        supportBand1,
        supportBand2,
        booker: booker ? toDbName(booker) : "",
        attendees: attendees.map(toDbName),
        standIns,
        date,
        venue,
        note,
        scoreMainAndreas,
        scoreMainDennis,
        scoreMainMagnus,
        scoreSupportAndreas,
        scoreSupportDennis,
        scoreSupportMagnus,
      });
      setOpen(false);
      router.refresh();
    } catch {
      setError(t("form.save_error"));
    } finally {
      setLoading(false);
    }
  }

  const NICKNAMES = MEMBER_LIST.map((m) => m.nickname);

  function toggleAttendee(name: string) {
    setAttendees((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="rounded p-1 text-coven-text-muted transition hover:bg-coven-active hover:text-coven-text"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-1" align="end">
          <button
            type="button"
            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-coven-text transition hover:bg-coven-active"
            onClick={() => {
              setMenuOpen(false);
              resetForm();
              setOpen(true);
            }}
          >
            {t("edit.action")}
          </button>
        </PopoverContent>
      </Popover>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-coven-surface text-coven-text">
          <DialogHeader>
            <DialogTitle>{t("form.edit_concert")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>{t("form.band_name")}</Label>
                <Input value={bandName} onChange={(e) => setBandName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("form.date")}</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("form.support_band_1")}</Label>
                <Input value={supportBand1} onChange={(e) => setSupportBand1(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("form.support_band_2")}</Label>
                <Input value={supportBand2} onChange={(e) => setSupportBand2(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("form.venue")}</Label>
                <Input value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>{t("form.booker")}</Label>
                <div className="flex gap-1">
                  {NICKNAMES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                        booker === name
                          ? "border-coven-primary bg-coven-primary/10 text-coven-primary"
                          : "border-coven-border text-coven-text-muted hover:border-coven-primary hover:text-coven-text"
                      }`}
                      onClick={() => setBooker(booker === name ? "" : name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label>{t("form.attendees")}</Label>
              <div className="flex gap-1">
                {NICKNAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition ${
                      attendees.includes(name)
                        ? "border-coven-primary bg-coven-primary/10 text-coven-primary"
                        : "border-coven-border text-coven-text-muted hover:border-coven-primary hover:text-coven-text"
                    }`}
                    onClick={() => toggleAttendee(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label>{t("form.standins")}</Label>
              <Input
                value={standIns.join(", ")}
                onChange={(e) =>
                  setStandIns(
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                placeholder="Kommaseparerte navn..."
              />
            </div>

            <div className="space-y-1">
              <Label>{t("form.note")}</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            {/* Scores */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-coven-text-muted">
                  {t("form.main_scores")}
                </Label>
                <ScoreInput label="Pilsen" value={scoreMainAndreas} onChange={setScoreMainAndreas} />
                <ScoreInput label="Djen" value={scoreMainDennis} onChange={setScoreMainDennis} />
                <ScoreInput label="Krem" value={scoreMainMagnus} onChange={setScoreMainMagnus} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-coven-text-muted">
                  {t("form.support_scores")}
                </Label>
                <ScoreInput label="Pilsen" value={scoreSupportAndreas} onChange={setScoreSupportAndreas} />
                <ScoreInput label="Djen" value={scoreSupportDennis} onChange={setScoreSupportDennis} />
                <ScoreInput label="Krem" value={scoreSupportMagnus} onChange={setScoreSupportMagnus} />
              </div>
            </div>

            {error && <p className="text-xs text-coven-danger">{error}</p>}

            <Button onClick={handleSave} disabled={loading} className="w-full">
              {loading ? t("form.updating") : t("form.update_concert")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
