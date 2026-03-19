/**
 * Run schema migration and import all concerts.
 * Usage: SUPABASE_ACCESS_TOKEN=sbp_... npx tsx scripts/migrate-and-import.ts
 */

const PROJECT_REF = "qkyuwerflagtnrayzbig";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("❌  SUPABASE_ACCESS_TOKEN env var is required");
  process.exit(1);
}

async function runSQL(query: string, label = "") {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`SQL failed (${label}): ${JSON.stringify(body)}`);
  }
  return body;
}

// ---------------------------------------------------------------------------
// 1. Schema migration
// ---------------------------------------------------------------------------
const MIGRATION_SQL = `
-- Add per-member score columns (idempotent)
ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS score_main_andreas   integer CHECK (score_main_andreas   BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_main_dennis    integer CHECK (score_main_dennis    BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_main_magnus    integer CHECK (score_main_magnus    BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_andreas integer CHECK (score_support_andreas BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_dennis  integer CHECK (score_support_dennis  BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS score_support_magnus  integer CHECK (score_support_magnus  BETWEEN 1 AND 6);

ALTER TABLE public.concerts
  ADD COLUMN IF NOT EXISTS stand_ins text[];

-- Drop old aggregate score columns
ALTER TABLE public.concerts
  DROP COLUMN IF EXISTS score_main,
  DROP COLUMN IF EXISTS score_support_1,
  DROP COLUMN IF EXISTS score_support_2;
`;

// ---------------------------------------------------------------------------
// Concert data
// ---------------------------------------------------------------------------
type ConcertRow = {
  band_name: string;
  support_band_1?: string | null;
  support_band_2?: string | null;
  booker?: string | null;
  attendees?: string[] | null;
  stand_ins?: string[] | null;
  date: string;
  venue?: string | null;
  score_main_andreas?: number | null;
  score_main_dennis?: number | null;
  score_main_magnus?: number | null;
  score_support_andreas?: number | null;
  score_support_dennis?: number | null;
  score_support_magnus?: number | null;
  alcohol_level?: number | null;
  note?: string | null;
};

const ALLE = ["Pils", "Djen", "Krem"];

const CONCERTS: ConcertRow[] = [
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
    score_main_andreas: null, score_main_dennis: 5, score_main_magnus: 5,
    score_support_andreas: null, score_support_dennis: null, score_support_magnus: null,
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
    score_main_andreas: 1, score_main_dennis: 2, score_main_magnus: null,
    score_support_andreas: null, score_support_dennis: null, score_support_magnus: null,
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
    score_support_andreas: null, score_support_dennis: null, score_support_magnus: null,
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
    score_main_andreas: null, score_main_dennis: 6, score_main_magnus: 5,
    score_support_andreas: null, score_support_dennis: 3, score_support_magnus: 3,
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
];

function toArrayLiteral(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "NULL";
  const escaped = arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",");
  return `ARRAY[${escaped}]`;
}

function val(v: string | number | null | undefined): string {
  if (v == null) return "NULL";
  if (typeof v === "number") return String(v);
  return `'${v.replace(/'/g, "''")}'`;
}

function buildInsert(c: ConcertRow, userId: string): string {
  return `INSERT INTO public.concerts (
    band_name, support_band_1, support_band_2, booker, attendees, stand_ins,
    date, venue,
    score_main_andreas, score_main_dennis, score_main_magnus,
    score_support_andreas, score_support_dennis, score_support_magnus,
    alcohol_level, note, images, created_by
  ) VALUES (
    ${val(c.band_name)},
    ${val(c.support_band_1)},
    ${val(c.support_band_2)},
    ${val(c.booker)},
    ${toArrayLiteral(c.attendees)},
    ${toArrayLiteral(c.stand_ins)},
    ${val(c.date)},
    ${val(c.venue)},
    ${val(c.score_main_andreas)},
    ${val(c.score_main_dennis)},
    ${val(c.score_main_magnus)},
    ${val(c.score_support_andreas)},
    ${val(c.score_support_dennis)},
    ${val(c.score_support_magnus)},
    NULL,
    ${val(c.note)},
    NULL,
    '${userId}'
  );`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("🔧 Step 1: Applying schema migration…");
  await runSQL(MIGRATION_SQL, "migration");
  console.log("   ✅ Schema updated");

  console.log("\n👤 Step 2: Fetching user ID…");
  const users = await runSQL(
    "SELECT id FROM auth.users ORDER BY created_at LIMIT 1;",
    "get user"
  );
  if (!users.length) {
    throw new Error("No users found in auth.users – sign up first.");
  }
  const userId: string = users[0].id;
  console.log(`   ✅ Using user: ${userId}`);

  console.log("\n🗑️  Step 3: Deleting existing concert data…");
  await runSQL("DELETE FROM public.concerts;", "delete all");
  console.log("   ✅ Cleared");

  console.log(`\n🎸 Step 4: Inserting ${CONCERTS.length} concerts…`);
  for (const concert of CONCERTS) {
    const sql = buildInsert(concert, userId);
    await runSQL(sql, concert.band_name);
    console.log(`   ✅ ${concert.band_name}`);
  }

  console.log("\n🎉 Done! All concerts imported successfully.");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
