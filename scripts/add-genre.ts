/**
 * Add genre column to concerts table and populate existing data.
 * Usage: npx tsx scripts/add-genre.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { sql } from "@vercel/postgres";

const GENRE_MAP: Record<string, string> = {
  "Aktiv Dödshjelp": "Punk Rock",
  "Spidergawd": "Rock",
  "The Good The Bad & The Zugly": "Hardcore Punk",
  "Kal-El": "Stoner Rock",
  "Susperia": "Black Metal",
  "Looser": "Punk Rock",
  "Black Tusk": "Sludge Metal",
  "The Sheepdogs": "Classic Rock",
  "Sheepdogs": "Classic Rock",
  "Skadefryd (Vader)": "Death Metal",
  "Vader": "Death Metal",
  "Taake": "Black Metal",
  "Rivers of Nihil": "Progressive Death Metal",
  "Orango": "Southern Rock",
  "Sepultura": "Thrash Metal",
  "Papangu": "Progressive Rock",
  "The Darkness": "Hard Rock",
  "Trueandtrue": "Indie Rock",
  "Henchlock": "Doom Metal",
  "Hällas": "Progressive Rock",
  "Bayker Blankenship": "Country",
};

async function main() {
  console.log("Adding genre column…");
  await sql`ALTER TABLE concerts ADD COLUMN IF NOT EXISTS genre TEXT`;
  console.log("Column added.");

  console.log("Populating genre data…");
  for (const [bandName, genre] of Object.entries(GENRE_MAP)) {
    const { rowCount } = await sql`
      UPDATE concerts SET genre = ${genre} WHERE band_name = ${bandName} AND genre IS NULL
    `;
    if (rowCount && rowCount > 0) {
      console.log(`  ✓ ${bandName} → ${genre}`);
    }
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
