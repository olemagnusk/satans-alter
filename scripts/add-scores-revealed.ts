import { sql } from "@vercel/postgres";

async function main() {
  console.log("Adding scores_revealed column…");
  await sql`
    ALTER TABLE concerts
    ADD COLUMN IF NOT EXISTS scores_revealed BOOLEAN NOT NULL DEFAULT FALSE
  `;

  console.log("Setting scores_revealed = true for concerts that already have scores…");
  await sql`
    UPDATE concerts
    SET scores_revealed = TRUE
    WHERE score_main_andreas IS NOT NULL
       OR score_main_dennis IS NOT NULL
       OR score_main_magnus IS NOT NULL
       OR score_support_andreas IS NOT NULL
       OR score_support_dennis IS NOT NULL
       OR score_support_magnus IS NOT NULL
  `;

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
