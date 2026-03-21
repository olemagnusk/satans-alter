import { sql } from "@vercel/postgres";
import type { Concert, ConcertInput } from "@/lib/validation/concert";

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
