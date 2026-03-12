import type { Concert } from "@/lib/validation/concert";

export function getTotals(concerts: Concert[]) {
  return {
    totalConcerts: concerts.length,
    totalAttendees: concerts.reduce(
      (sum, c) => sum + (c.attendees ?? 0),
      0
    )
  };
}

export function getAverageMainScore(concerts: Concert[]) {
  const scored = concerts.filter((c) => c.score_main != null);
  if (!scored.length) return null;
  const total = scored.reduce(
    (sum, c) => sum + (c.score_main ?? 0),
    0
  );
  return total / scored.length;
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

export function getTopBandsByScore(concerts: Concert[], limit = 5) {
  const bandScores = new Map<string, { total: number; count: number }>();
  for (const c of concerts) {
    if (!c.band_name || c.score_main == null) continue;
    const current = bandScores.get(c.band_name) ?? { total: 0, count: 0 };
    current.total += c.score_main;
    current.count += 1;
    bandScores.set(c.band_name, current);
  }
  return Array.from(bandScores.entries())
    .map(([band, { total, count }]) => ({
      band,
      average: total / count,
      count
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, limit);
}

