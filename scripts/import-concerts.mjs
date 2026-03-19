import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const row = {};
    for (let i = 0; i < headers.length; i += 1) {
      row[headers[i]] = (cells[i] ?? "").trim();
    }
    return row;
  });
}

function parseCsvLine(line) {
  // Minimal RFC4180-ish parser: handles quotes and commas in quoted fields.
  const out = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = line[i + 1];
        if (next === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out;
}

function parseAttendees(raw) {
  const v = (raw ?? "").trim();
  if (!v) return [];
  if (v.toLowerCase() === "alle") return ["Magnus", "Dennis", "Andreas"];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function average(nums) {
  const xs = nums.filter((n) => Number.isFinite(n));
  if (!xs.length) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function averageToInt(nums) {
  const avg = average(nums);
  if (avg == null) return null;
  return Math.round(avg);
}

function parseScore(raw) {
  const v = (raw ?? "").trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeDate(rawDate, note) {
  // This CSV contains mostly month/year. For "final" storage we need exact dates.
  // For now we store the 1st of the month and annotate if it was not exact.
  // Known exact date:
  if ((rawDate ?? "").trim() === "" && (note ?? "").includes("The Darkness")) {
    return { date: "2025-10-06", exact: true };
  }

  const v = (rawDate ?? "").trim().toLowerCase();

  // If already ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return { date: v, exact: true };

  const monthMap = new Map([
    ["jan", 1],
    ["januar", 1],
    ["feb", 2],
    ["februar", 2],
    ["mar", 3],
    ["mars", 3],
    ["apr", 4],
    ["april", 4],
    ["mai", 5],
    ["jun", 6],
    ["juni", 6],
    ["jul", 7],
    ["juli", 7],
    ["aug", 8],
    ["august", 8],
    ["sep", 9],
    ["sept", 9],
    ["september", 9],
    ["okt", 10],
    ["oktober", 10],
    ["nov", 11],
    ["november", 11],
    ["des", 12],
    ["desember", 12],
    ["desmber", 12],
  ]);

  // Examples: "nov., 23", "januar 24", "mars 25"
  const cleaned = v.replace(/[.,]/g, "").replace(/\s+/g, " ").trim();
  const parts = cleaned.split(" ");
  if (parts.length >= 2) {
    const m = monthMap.get(parts[0]);
    const yPart = parts[1].replace(/[^0-9]/g, "");
    if (m && yPart) {
      const yy = Number(yPart);
      const year = yy < 100 ? 2000 + yy : yy;
      const month = String(m).padStart(2, "0");
      return { date: `${year}-${month}-01`, exact: false };
    }
  }

  throw new Error(`Unrecognized date format: "${rawDate}"`);
}

function extractStandinsFromComment(comment) {
  // Stand-ins are a separate column; scores remain in comment.
  const c = (comment ?? "").trim();
  if (!c) return [];
  const found = new Set();
  // Current known pattern: "Endre ..." in comment.
  if (/\bendre\b/i.test(c)) found.add("Endre");
  return Array.from(found);
}

async function main() {
  const csvPath =
    process.env.CSV_PATH ??
    path.resolve(process.cwd(), "../Downloads/Regneark uten navn - Ark 1.csv");

  const url = process.env.SUPABASE_URL ?? "http://127.0.0.1:54321";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY env var (use local 'Secret' from `supabase status`)."
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const csvText = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(csvText);

  // Delete obvious mock rows + prior imports in local env
  // (we keep it simple: wipe all to ensure import is idempotent locally)
  const { error: delErr } = await supabase.from("concerts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) throw delErr;

  const inserts = rows.map((r) => {
    const bandName = r["Band"];
    const booker = r["Booker"];
    const support = r["Support"];
    const venue = r["Venue"];
    const attendees = parseAttendees(r["Attendees"]);
    const note = r["Kommentar"] || null;

    const standIns = extractStandinsFromComment(note);

    const mainScores = [
      parseScore(r["Main Score Andreas"]),
      parseScore(r["Main Score Dennis"]),
      parseScore(r["Main Score Magnus"]),
    ];
    const supportScores = [
      parseScore(r["Support Score Andreas"]),
      parseScore(r["Support Score Dennis"]),
      parseScore(r["Support Score Magnus"]),
    ];

    const norm = normalizeDate(r["Dato"], bandName);
    const dateNote = norm.exact ? "" : " [DATE TBD: only month/year known]";
    const mergedNote =
      (note ?? "") + dateNote || (dateNote ? dateNote.trim() : null);

    return {
      band_name: bandName,
      support_band_1: support || null,
      support_band_2: null,
      booker: booker || null,
      attendees: attendees.length ? attendees : null,
      stand_ins: standIns.length ? standIns : null,
      date: norm.date,
      score_main: averageToInt(mainScores),
      score_support_1: averageToInt(supportScores),
      score_support_2: null,
      venue: venue || null,
      alcohol_level: null,
      note: mergedNote || null,
      images: null,
      created_by: null,
    };
  });

  const { error: insErr } = await supabase.from("concerts").insert(inserts);
  if (insErr) throw insErr;

  const { count, error: countErr } = await supabase
    .from("concerts")
    .select("*", { count: "exact", head: true });
  if (countErr) throw countErr;

  console.log(`Imported ${inserts.length} concerts. DB now has ${count} concerts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

