import { sql } from "@vercel/postgres";

export async function getNextConcertDate(): Promise<string | null> {
  const { rows } = await sql`
    SELECT value FROM app_settings WHERE key = 'next_concert_date'
  `;
  return rows[0]?.value ?? null;
}

export async function setNextConcertDate(date: string): Promise<void> {
  await sql`
    INSERT INTO app_settings (key, value)
    VALUES ('next_concert_date', ${date})
    ON CONFLICT (key) DO UPDATE SET value = ${date}, updated_at = NOW()
  `;
}

export async function getNextConcertBooker(): Promise<string | null> {
  const { rows } = await sql`
    SELECT value FROM app_settings WHERE key = 'next_concert_booker'
  `;
  return rows[0]?.value ?? null;
}

export async function setNextConcertBooker(booker: string): Promise<void> {
  await sql`
    INSERT INTO app_settings (key, value)
    VALUES ('next_concert_booker', ${booker})
    ON CONFLICT (key) DO UPDATE SET value = ${booker}, updated_at = NOW()
  `;
}
