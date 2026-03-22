import type { Concert } from "@/lib/validation/concert";

/** Average of up to 3 non-null main scores for a single concert. Only counts revealed scores. */
function concertAvgMain(c: Concert): number | null {
  if (!c.scores_revealed) return null;
  const vals = [c.score_main_andreas, c.score_main_dennis, c.score_main_magnus].filter(
    (v): v is number => v != null
  );
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function getTotals(concerts: Concert[]) {
  const totalAttendees = concerts.reduce(
    (sum, c) => sum + (c.attendees?.length ?? 0),
    0
  );
  return {
    totalConcerts: concerts.length,
    totalAttendees
  };
}

export function getAverageMainScore(concerts: Concert[]) {
  const avgs = concerts.map(concertAvgMain).filter((v): v is number => v != null);
  if (!avgs.length) return null;
  return avgs.reduce((a, b) => a + b, 0) / avgs.length;
}

/** Average of up to 3 non-null support scores for a single concert. Only counts revealed scores. */
function concertAvgSupport(c: Concert): number | null {
  if (!c.scores_revealed) return null;
  const vals = [c.score_support_andreas, c.score_support_dennis, c.score_support_magnus].filter(
    (v): v is number => v != null
  );
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function getAverageSupportScore(concerts: Concert[]) {
  const avgs = concerts.map(concertAvgSupport).filter((v): v is number => v != null);
  if (!avgs.length) return null;
  return avgs.reduce((a, b) => a + b, 0) / avgs.length;
}

export function getTopVenues(concerts: Concert[], limit = 3): { venue: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of concerts) {
    if (!c.venue) continue;
    counts.set(c.venue, (counts.get(c.venue) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([venue, count]) => ({ venue, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getMostFrequentVenue(concerts: Concert[]) {
  const counts = new Map<string, number>();
  for (const c of concerts) {
    if (!c.venue) continue;
    counts.set(c.venue, (counts.get(c.venue) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [venue, count] of counts) {
    if (count > bestCount) {
      best = venue;
      bestCount = count;
    }
  }
  return best;
}

export function getTopBandsByScore(concerts: Concert[], limit?: number) {
  const bandScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.band_name) continue;
    const avg = concertAvgMain(c);
    if (avg == null) continue;
    const current = bandScores.get(c.band_name) ?? { total: 0, count: 0 };
    current.total += avg;
    current.count += 1;
    bandScores.set(c.band_name, current);
  }
  const sorted = Array.from(bandScores.entries())
    .map(([band, { total, count }]) => ({
      band,
      average: total / count,
      count
    }))
    .sort((a, b) => b.average - a.average);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getTopSupportBandsByScore(concerts: Concert[], limit?: number) {
  const bandScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    const name = c.support_band_1;
    if (!name) continue;
    const avg = concertAvgSupport(c);
    if (avg == null) continue;
    const current = bandScores.get(name) ?? { total: 0, count: 0 };
    current.total += avg;
    current.count += 1;
    bandScores.set(name, current);
  }
  const sorted = Array.from(bandScores.entries())
    .map(([band, { total, count }]) => ({
      band,
      average: total / count,
      count
    }))
    .sort((a, b) => b.average - a.average);
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getAverageScorePerVenue(concerts: Concert[], limit?: number) {
  const venueScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.venue) continue;
    const avg = concertAvgMain(c);
    if (avg == null) continue;
    const current = venueScores.get(c.venue) ?? { total: 0, count: 0 };
    current.total += avg;
    current.count += 1;
    venueScores.set(c.venue, current);
  }
  const sorted = Array.from(venueScores.entries())
    .map(([venue, { total, count }]) => ({
      venue,
      average: total / count,
      count
    }))
    .sort((a, b) => b.average - a.average);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Average main score grouped by booker. */
export function getBookerScore(concerts: Concert[]): { booker: string; average: number; count: number }[] {
  const bookerScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.booker) continue;
    const avg = concertAvgMain(c);
    if (avg == null) continue;
    const current = bookerScores.get(c.booker) ?? { total: 0, count: 0 };
    current.total += avg;
    current.count += 1;
    bookerScores.set(c.booker, current);
  }
  return Array.from(bookerScores.entries())
    .map(([booker, { total, count }]) => ({
      booker,
      average: total / count,
      count,
    }))
    .sort((a, b) => b.average - a.average);
}

/** Count of concerts per year. */
export function getConcertsPerYear(concerts: Concert[]): { year: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const c of concerts) {
    const year = parseInt(c.date.slice(0, 4), 10);
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);
}

export type ScoreOverTimePoint = {
  date: string;
  month: string;
  year: number;
  band: string;
  avgScore: number;
};

export function getScoreOverTime(concerts: Concert[]): ScoreOverTimePoint[] {
  return concerts
    .filter((c) => concertAvgMain(c) != null)
    .map((c) => ({
      date: c.date,
      month: c.date.slice(0, 7), // YYYY-MM
      year: parseInt(c.date.slice(0, 4), 10),
      band: c.band_name,
      avgScore: concertAvgMain(c)!,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
