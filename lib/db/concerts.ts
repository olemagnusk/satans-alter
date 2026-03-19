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
      attendees: input.attendees?.length ? input.attendees : null,
      stand_ins: input.standIns?.length ? input.standIns : null,
      date: input.date,
      venue: input.venue || null,
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

