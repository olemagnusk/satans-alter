/**
 * Create the concerts table and seed it with data.
 * Usage: npx tsx scripts/seed.ts
 *
 * Reads POSTGRES_URL from .env.local (run `vercel env pull .env.local` first).
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

const ALLE = ["Pils", "Djen", "Krem"];

const CONCERTS = [
  {
    band_name: "Aktiv Dödshjelp",
    date: "2023-11-01",
    booker: "Pils",
    venue: "John Dee",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 4, score_main_magnus: 4,
    score_support_andreas: 4, score_support_dennis: 4, score_support_magnus: 4,
  },
  {
    band_name: "Spidergawd",
    date: "2024-01-01",
    booker: "Krem",
    venue: "Rockefeller",
    attendees: ALLE,
    score_main_andreas: 3, score_main_dennis: 3, score_main_magnus: 4,
    score_support_andreas: 3, score_support_dennis: 3, score_support_magnus: 4,
  },
  {
    band_name: "The Good The Bad & The Zugly",
    date: "2024-03-01",
    booker: "Djen",
    venue: "Rockefeller",
    attendees: ALLE,
    score_main_andreas: 5, score_main_dennis: 6, score_main_magnus: 5,
    score_support_andreas: 5, score_support_dennis: 6, score_support_magnus: 5,
  },
  {
    band_name: "Kal-El",
    support_band_1: "Suncraft",
    date: "2024-05-01",
    booker: "Djen",
    venue: "Rockefeller",
    attendees: ALLE,
    score_main_andreas: 3, score_main_dennis: 3, score_main_magnus: 3,
    score_support_andreas: 5, score_support_dennis: 5, score_support_magnus: 4,
  },
  {
    band_name: "Susperia",
    date: "2024-06-01",
    booker: "Krem",
    venue: "John Dee",
    attendees: ["Krem", "Djen"],
    score_main_dennis: 5, score_main_magnus: 5,
    note: "Dobbeltbooka jøde. Skammer seg.",
  },
  {
    band_name: "Looser",
    support_band_1: "Lommekniv",
    date: "2024-08-01",
    booker: "Djen",
    venue: "Vaterland",
    attendees: ["Krem", "Djen"],
    stand_ins: ["Endre"],
    score_main_andreas: 1, score_main_dennis: 2,
    note: "Endre dekker for Magnus. Looser: 4, LK: 3",
  },
  {
    band_name: "Black Tusk",
    support_band_1: "Grand Atomic",
    date: "2024-10-01",
    booker: "Pils",
    venue: "Vaterland",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 4, score_main_magnus: 4,
    score_support_andreas: 2, score_support_dennis: 2, score_support_magnus: 2,
  },
  {
    band_name: "Sheepdogs",
    support_band_1: "The Commoners",
    date: "2024-11-01",
    booker: "Krem",
    venue: "John Dee",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 6, score_main_magnus: 6,
    score_support_andreas: 4, score_support_dennis: 5, score_support_magnus: 5,
    note: "Djen: 6+ (over Suncraft!) (+6, D og M er K inspirert!)",
  },
  {
    band_name: "Skadefryd (Vader)",
    support_band_1: "Toxaemia",
    date: "2024-12-01",
    booker: "Djen",
    venue: "John Dee",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 4, score_main_magnus: 4,
    score_support_andreas: 3, score_support_dennis: 2, score_support_magnus: 1,
    note: "Skadefryd på Hærverk avlyst! Rask gange til JD.",
  },
  {
    band_name: "Taake",
    support_band_1: "Nattefrost",
    date: "2025-01-01",
    booker: "Pils",
    venue: "Vulkan Arena",
    attendees: ALLE,
    score_main_andreas: 5, score_main_dennis: 4, score_main_magnus: 4,
    score_support_andreas: 3, score_support_dennis: 1, score_support_magnus: 2,
  },
  {
    band_name: "Rivers of Nihil",
    support_band_1: "Cynic",
    date: "2025-03-01",
    booker: "Krem",
    venue: "John Dee",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 3, score_main_magnus: 3,
    score_support_andreas: 2, score_support_dennis: 1, score_support_magnus: 1,
    note: "Rivers uten vokal. Syk.",
  },
  {
    band_name: "Orango",
    support_band_1: "High Chief",
    date: "2025-05-01",
    booker: "Djen",
    venue: "Parkteateret",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 5, score_main_magnus: 4,
    score_support_andreas: 5, score_support_dennis: 5, score_support_magnus: 5,
  },
  {
    band_name: "Sepultura",
    date: "2025-06-01",
    booker: "Pils",
    venue: "Sentrum Scene",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 4, score_main_magnus: 4,
  },
  {
    band_name: "Papangu",
    support_band_1: "Sex Magic Wizard",
    date: "2025-09-01",
    booker: "Krem",
    venue: "Vaterland",
    attendees: ALLE,
    score_main_andreas: 4, score_main_dennis: 4, score_main_magnus: 4,
    score_support_andreas: 1, score_support_dennis: 1, score_support_magnus: 2,
  },
  {
    band_name: "The Darkness",
    date: "2025-10-06",
    booker: "Djen",
    venue: "Rockefeller",
    attendees: ["Djen", "Krem"],
    stand_ins: ["Endre"],
    score_main_dennis: 6, score_main_magnus: 5,
    score_support_dennis: 3, score_support_magnus: 3,
    note: "Endre step in. Darkness: 4",
  },
  {
    band_name: "Trueandtrue",
    support_band_1: "Døden 505",
    date: "2025-10-01",
    booker: "Pils",
    venue: "Revolver",
    attendees: ALLE,
    score_main_andreas: 3, score_main_dennis: 3, score_main_magnus: 3,
    score_support_andreas: 4, score_support_dennis: 2, score_support_magnus: 3,
  },
  {
    band_name: "Henchlock",
    support_band_1: "Kløster",
    date: "2025-12-01",
    booker: "Krem",
    venue: "Revolver",
    attendees: ALLE,
    score_main_andreas: 1, score_main_dennis: 3, score_main_magnus: 2,
    score_support_andreas: 4, score_support_dennis: 4, score_support_magnus: 4,
  },
  {
    band_name: "Hällas",
    date: "2026-02-01",
    booker: "Djen",
    venue: "Rockefeller",
    attendees: ALLE,
    score_main_andreas: 3, score_main_dennis: 2, score_main_magnus: 3,
    score_support_andreas: 2, score_support_dennis: 1, score_support_magnus: 1,
  },
  {
    band_name: "Bayker Blankenship",
    support_band_1: "Noah James",
    date: "2026-02-01",
    booker: "Pils",
    venue: "Rockefeller",
    attendees: ALLE,
    score_main_andreas: 3, score_main_dennis: 2, score_main_magnus: 3,
    score_support_andreas: 2, score_support_dennis: 1, score_support_magnus: 1,
  },
] as const;

async function main() {
  console.log("Creating concerts table…");
  await sql`
    CREATE TABLE IF NOT EXISTS concerts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      band_name TEXT NOT NULL,
      support_band_1 TEXT,
      support_band_2 TEXT,
      booker TEXT,
      attendees TEXT[],
      stand_ins TEXT[],
      date TEXT NOT NULL,
      score_main_andreas INTEGER CHECK (score_main_andreas BETWEEN 1 AND 6),
      score_main_dennis INTEGER CHECK (score_main_dennis BETWEEN 1 AND 6),
      score_main_magnus INTEGER CHECK (score_main_magnus BETWEEN 1 AND 6),
      score_support_andreas INTEGER CHECK (score_support_andreas BETWEEN 1 AND 6),
      score_support_dennis INTEGER CHECK (score_support_dennis BETWEEN 1 AND 6),
      score_support_magnus INTEGER CHECK (score_support_magnus BETWEEN 1 AND 6),
      venue TEXT,
      note TEXT,
      images JSONB,
      created_by TEXT
    )
  `;
  console.log("Table ready.");

  console.log("Creating app_settings table…");
  await sql`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  console.log("Settings table ready.");

  console.log("Clearing existing data…");
  await sql`DELETE FROM concerts`;

  console.log(`Inserting ${CONCERTS.length} concerts…`);
  for (const c of CONCERTS) {
    await sql`
      INSERT INTO concerts (
        band_name, support_band_1, support_band_2, booker,
        attendees, stand_ins, date, venue,
        score_main_andreas, score_main_dennis, score_main_magnus,
        score_support_andreas, score_support_dennis, score_support_magnus,
        note, created_by
      ) VALUES (
        ${c.band_name},
        ${(c as any).support_band_1 ?? null},
        ${(c as any).support_band_2 ?? null},
        ${(c as any).booker ?? null},
        ${(c as any).attendees ?? null},
        ${(c as any).stand_ins ?? null},
        ${c.date},
        ${(c as any).venue ?? null},
        ${(c as any).score_main_andreas ?? null},
        ${(c as any).score_main_dennis ?? null},
        ${(c as any).score_main_magnus ?? null},
        ${(c as any).score_support_andreas ?? null},
        ${(c as any).score_support_dennis ?? null},
        ${(c as any).score_support_magnus ?? null},
        ${(c as any).note ?? null},
        ${"sa"}
      )
    `;
    console.log(`  ✓ ${c.band_name}`);
  }

  console.log(`\nDone! ${CONCERTS.length} concerts seeded.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
