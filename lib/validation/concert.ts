import { z } from "zod";
import { t } from "@/lib/i18n";

export const concertInputSchema = z.object({
  bandName: z.string().min(1, t("validation.band_required")),
  supportBand1: z.string().optional().or(z.literal("")),
  supportBand2: z.string().optional().or(z.literal("")),
  booker: z.string().optional().or(z.literal("")),
  attendees: z.array(z.string()).optional(),
  standIns: z.array(z.string()).optional(),
  date: z.string().min(1, t("validation.date_required")),
  venue: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal(""))
});

const scoreField = z.number().int().min(1).max(6).nullable().optional();

export const concertUpdateSchema = concertInputSchema.extend({
  scoreMainAndreas: scoreField,
  scoreMainDennis: scoreField,
  scoreMainMagnus: scoreField,
  scoreSupportAndreas: scoreField,
  scoreSupportDennis: scoreField,
  scoreSupportMagnus: scoreField,
});

export type ConcertFormValues = z.input<typeof concertInputSchema>;
export type ConcertInput = z.output<typeof concertInputSchema>;
export type ConcertUpdateInput = z.output<typeof concertUpdateSchema>;

export type Concert = {
  id: string;
  created_at: string;
  band_name: string;
  support_band_1: string | null;
  support_band_2: string | null;
  booker: string | null;
  attendees: string[] | null;
  stand_ins: string[] | null;
  date: string;
  score_main_andreas: number | null;
  score_main_dennis: number | null;
  score_main_magnus: number | null;
  score_support_andreas: number | null;
  score_support_dennis: number | null;
  score_support_magnus: number | null;
  venue: string | null;
  note: string | null;
  images: { storagePath: string; publicUrl: string }[] | null;
  created_by: string | null;
};
