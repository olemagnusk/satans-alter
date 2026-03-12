import { z } from "zod";

export const concertInputSchema = z.object({
  bandName: z.string().min(1, "Band name is required"),
  supportBand1: z.string().optional().or(z.literal("")),
  supportBand2: z.string().optional().or(z.literal("")),
  booker: z.string().optional().or(z.literal("")),
  attendees: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || val == null ? undefined : Number(val)))
    .refine(
      (val) => val === undefined || (!Number.isNaN(val) && val >= 0),
      "Attendees must be a non-negative number"
    ),
  date: z.string().min(1, "Date is required"),
  scoreMain: z
    .number()
    .int()
    .min(1)
    .max(6)
    .optional(),
  scoreSupport1: z
    .number()
    .int()
    .min(1)
    .max(6)
    .optional(),
  scoreSupport2: z
    .number()
    .int()
    .min(1)
    .max(6)
    .optional(),
  venue: z.string().optional().or(z.literal("")),
  alcoholLevel: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || val == null ? undefined : Number(val)))
    .refine(
      (val) =>
        val === undefined || (!Number.isNaN(val) && val >= 0 && val <= 10),
      "Alcohol level must be between 0 and 10"
    ),
  note: z.string().optional().or(z.literal(""))
});

export type ConcertFormValues = z.input<typeof concertInputSchema>;
export type ConcertInput = z.output<typeof concertInputSchema>;

export type Concert = {
  id: string;
  created_at: string;
  band_name: string;
  support_band_1: string | null;
  support_band_2: string | null;
  booker: string | null;
  attendees: number | null;
  date: string;
  score_main: number | null;
  score_support_1: number | null;
  score_support_2: number | null;
  venue: string | null;
  alcohol_level: number | null;
  note: string | null;
  images: { storagePath: string; publicUrl: string }[] | null;
  created_by: string | null;
};

