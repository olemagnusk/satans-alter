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
      attendees, stand_ins, date, venue, note, images, created_by, genre
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
      ${userId},
      ${input.genre || null}
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
      score_support_magnus = ${input.scoreSupportMagnus ?? null},
      genre = ${input.genre || null}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as Concert;
}

export async function deleteConcert(id: string): Promise<void> {
  await sql`DELETE FROM concerts WHERE id = ${id}`;
}

/**
 * Find the most recent concert that doesn't have all scores filled
 * AND was created within the last 12 hours.
 * Used by the "Legg til score" flow.
 */
export async function getLatestUnscoredConcert(): Promise<Concert | null> {
  const { rows } = await sql`
    SELECT * FROM concerts
    WHERE (score_main_andreas IS NULL
       OR score_main_dennis IS NULL
       OR score_main_magnus IS NULL)
      AND created_at >= NOW() - INTERVAL '12 hours'
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return (rows[0] as Concert) ?? null;
}

/**
 * Submit scores for a single member.
 * Only updates the columns for the specified member (by dbName).
 */
export async function submitMemberScores(
  concertId: string,
  member: "andreas" | "dennis" | "magnus",
  mainScore: number,
  supportScore: number | null
): Promise<void> {
  if (member === "andreas") {
    await sql`
      UPDATE concerts SET
        score_main_andreas = ${mainScore},
        score_support_andreas = ${supportScore}
      WHERE id = ${concertId}
    `;
  } else if (member === "dennis") {
    await sql`
      UPDATE concerts SET
        score_main_dennis = ${mainScore},
        score_support_dennis = ${supportScore}
      WHERE id = ${concertId}
    `;
  } else {
    await sql`
      UPDATE concerts SET
        score_main_magnus = ${mainScore},
        score_support_magnus = ${supportScore}
      WHERE id = ${concertId}
    `;
  }
}

/**
 * Check which members have submitted scores for a concert.
 */
export async function getScoreStatus(concertId: string): Promise<{
  concert: Concert;
  submitted: { andreas: boolean; dennis: boolean; magnus: boolean };
  allSubmitted: boolean;
}> {
  const { rows } = await sql`SELECT * FROM concerts WHERE id = ${concertId}`;
  const concert = rows[0] as Concert;
  const submitted = {
    andreas: concert.score_main_andreas != null,
    dennis: concert.score_main_dennis != null,
    magnus: concert.score_main_magnus != null,
  };
  return {
    concert,
    submitted,
    allSubmitted: submitted.andreas && submitted.dennis && submitted.magnus,
  };
}

/**
 * Mark scores as revealed (only booker should call this).
 */
export async function revealScores(concertId: string): Promise<void> {
  await sql`UPDATE concerts SET scores_revealed = TRUE WHERE id = ${concertId}`;
}
