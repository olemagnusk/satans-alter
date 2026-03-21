import { sql } from "@vercel/postgres";
import type { Concert, ConcertInput, ConcertUpdateInput } from "@/lib/validation/concert";

export async function listConcerts(): Promise<Concert[]> {
  const { rows } = await sql`SELECT * FROM concerts ORDER BY date DESC`;
  return rows as Concert[];
}

function toPostgresArray(arr: string[] | undefined): string | null {
  if (!arr?.length) return null;
  return `{${arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`;
}

export async function createConcert(input: ConcertInput, userId: string): Promise<Concert> {
  const attendees = toPostgresArray(input.attendees);
  const standIns = toPostgresArray(input.standIns);

  const { rows } = await sql`
    INSERT INTO concerts (
      band_name, support_band_1, support_band_2, booker,
      attendees, stand_ins, date, venue, note, images, created_by
    ) VALUES (
      ${input.bandName},
      ${input.supportBand1 || null},
      ${input.supportBand2 || null},
      ${input.booker || null},
      ${attendees},
      ${standIns},
      ${input.date},
      ${input.venue || null},
      ${input.note || null},
      ${null},
      ${userId}
    )
    RETURNING *
  `;
  return rows[0] as Concert;
}

export async function updateConcert(id: string, input: ConcertUpdateInput): Promise<Concert> {
  const attendees = toPostgresArray(input.attendees);
  const standIns = toPostgresArray(input.standIns);

  const { rows } = await sql`
    UPDATE concerts SET
      band_name = ${input.bandName},
      support_band_1 = ${input.supportBand1 || null},
      support_band_2 = ${input.supportBand2 || null},
      booker = ${input.booker || null},
      attendees = ${attendees},
      stand_ins = ${standIns},
      date = ${input.date},
      venue = ${input.venue || null},
      note = ${input.note || null},
      score_main_andreas = ${input.scoreMainAndreas ?? null},
      score_main_dennis = ${input.scoreMainDennis ?? null},
      score_main_magnus = ${input.scoreMainMagnus ?? null},
      score_support_andreas = ${input.scoreSupportAndreas ?? null},
      score_support_dennis = ${input.scoreSupportDennis ?? null},
      score_support_magnus = ${input.scoreSupportMagnus ?? null}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Concert;
}

export async function deleteConcert(id: string): Promise<void> {
  await sql`DELETE FROM concerts WHERE id = ${id}`;
}
