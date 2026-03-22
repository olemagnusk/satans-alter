import type { Concert } from "@/lib/validation/concert";
import { MEMBERS } from "@/lib/members";

type ScoreKey = keyof Concert;

function mainKey(dbName: string): ScoreKey {
  return `score_main_${dbName.toLowerCase()}` as ScoreKey;
}

function supportKey(dbName: string): ScoreKey {
  return `score_support_${dbName.toLowerCase()}` as ScoreKey;
}

/** Average score a specific member gave to main bands. */
export function getPersonalAvgMain(concerts: Concert[], dbName: string): number | null {
  const key = mainKey(dbName);
  const scores = concerts
    .filter((c) => c.scores_revealed && c[key] != null)
    .map((c) => c[key] as number);
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/** Average score a specific member gave to support bands. */
export function getPersonalAvgSupport(concerts: Concert[], dbName: string): number | null {
  const key = supportKey(dbName);
  const scores = concerts
    .filter((c) => c.scores_revealed && c[key] != null)
    .map((c) => c[key] as number);
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/** Top venue for a specific member based on their average main score at each venue. */
export function getPersonalTopVenue(
  concerts: Concert[],
  dbName: string,
  limit?: number
): { venue: string; average: number; count: number }[] {
  const key = mainKey(dbName);
  const venueScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.venue || !c.scores_revealed || c[key] == null) continue;
    const current = venueScores.get(c.venue) ?? { total: 0, count: 0 };
    current.total += c[key] as number;
    current.count += 1;
    venueScores.set(c.venue, current);
  }
  const sorted = Array.from(venueScores.entries())
    .map(([venue, { total, count }]) => ({
      venue,
      average: total / count,
      count,
    }))
    .sort((a, b) => b.average - a.average);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Top genre for a specific member based on their average main score per genre. */
export function getPersonalTopGenre(
  concerts: Concert[],
  dbName: string,
  limit?: number
): { genre: string; average: number; count: number }[] {
  const key = mainKey(dbName);
  const genreScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.genre || !c.scores_revealed || c[key] == null) continue;
    const current = genreScores.get(c.genre) ?? { total: 0, count: 0 };
    current.total += c[key] as number;
    current.count += 1;
    genreScores.set(c.genre, current);
  }
  const sorted = Array.from(genreScores.entries())
    .map(([genre, { total, count }]) => ({
      genre,
      average: total / count,
      count,
    }))
    .sort((a, b) => b.average - a.average);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Top bands for a specific member based on their main score. */
export function getPersonalTopBand(
  concerts: Concert[],
  dbName: string,
  limit?: number
): { band: string; score: number }[] {
  const key = mainKey(dbName);
  const results: { band: string; score: number }[] = [];
  for (const c of concerts) {
    if (!c.scores_revealed || c[key] == null) continue;
    results.push({ band: c.band_name, score: c[key] as number });
  }
  results.sort((a, b) => b.score - a.score);
  return limit ? results.slice(0, limit) : results;
}

/** Score distribution (count of each score 1-6) for a member's main scores, with band names. */
export function getScoreDistribution(
  concerts: Concert[],
  dbName: string
): { score: number; count: number; bands: string[] }[] {
  const key = mainKey(dbName);
  const buckets = new Map<number, string[]>();
  for (let i = 1; i <= 6; i++) buckets.set(i, []);
  for (const c of concerts) {
    if (!c.scores_revealed || c[key] == null) continue;
    const s = c[key] as number;
    buckets.get(s)?.push(c.band_name);
  }
  return Array.from(buckets.entries())
    .map(([score, bands]) => ({ score, count: bands.length, bands }))
    .sort((a, b) => a.score - b.score);
}

/** Build all per-member stats in one pass. */
export function getAllPersonalStats(concerts: Concert[]) {
  return MEMBERS.map((m) => ({
    nickname: m.nickname,
    dbName: m.dbName,
    avgMain: getPersonalAvgMain(concerts, m.dbName),
    avgSupport: getPersonalAvgSupport(concerts, m.dbName),
    topVenues: getPersonalTopVenue(concerts, m.dbName),
    topGenres: getPersonalTopGenre(concerts, m.dbName),
    topBands: getPersonalTopBand(concerts, m.dbName),
    scoreDistribution: getScoreDistribution(concerts, m.dbName),
  }));
}
