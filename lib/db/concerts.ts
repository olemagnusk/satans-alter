import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Concert, ConcertInput } from "@/lib/validation/concert";

export async function createConcert(input: ConcertInput, userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("concerts")
    .insert({
      band_name: input.bandName,
      support_band_1: input.supportBand1 || null,
      support_band_2: input.supportBand2 || null,
      booker: input.booker || null,
      attendees: input.attendees ?? null,
      date: input.date,
      score_main: input.scoreMain ?? null,
      score_support_1: input.scoreSupport1 ?? null,
      score_support_2: input.scoreSupport2 ?? null,
      venue: input.venue || null,
      alcohol_level: input.alcoholLevel ?? null,
      note: input.note || null,
      images: null,
      created_by: userId
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Concert;
}

export async function listConcerts(): Promise<Concert[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Concert[];
}

