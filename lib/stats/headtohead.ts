import type { Concert } from "@/lib/validation/concert";
import { MEMBERS } from "@/lib/members";

type ScoreKey = keyof Concert;

function mainKey(dbName: string): ScoreKey {
  return `score_main_${dbName.toLowerCase()}` as ScoreKey;
}

/** Average main score each member gives — sorted strictest to kindest. */
export function getStrictestScorer(
  concerts: Concert[]
): { nickname: string; average: number; count: number }[] {
  return MEMBERS.map((m) => {
    const key = mainKey(m.dbName);
    const scores = concerts
      .filter((c) => c.scores_revealed && c[key] != null)
      .map((c) => c[key] as number);
    const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { nickname: m.nickname, average, count: scores.length };
  })
    .filter((m) => m.count > 0)
    .sort((a, b) => a.average - b.average);
}

export type BandDisagreement = {
  band: string;
  diff: number;
  scores: { nickname: string; score: number }[];
};

export type DisagreementPair = {
  pair: string;
  nicknames: [string, string];
  avgDiff: number;
  count: number;
  topBands: BandDisagreement[];
};

/** For each pair of members, compute average absolute score difference + top disagreed bands. */
export function getMostDisagreedPairs(concerts: Concert[]): DisagreementPair[] {
  const pairs: DisagreementPair[] = [];

  for (let i = 0; i < MEMBERS.length; i++) {
    for (let j = i + 1; j < MEMBERS.length; j++) {
      const keyA = mainKey(MEMBERS[i].dbName);
      const keyB = mainKey(MEMBERS[j].dbName);
      const diffs: number[] = [];
      const bandDiffs: BandDisagreement[] = [];

      for (const c of concerts) {
        if (!c.scores_revealed || c[keyA] == null || c[keyB] == null) continue;
        const scoreA = c[keyA] as number;
        const scoreB = c[keyB] as number;
        const diff = Math.abs(scoreA - scoreB);
        diffs.push(diff);
        bandDiffs.push({
          band: c.band_name,
          diff,
          scores: [
            { nickname: MEMBERS[i].nickname, score: scoreA },
            { nickname: MEMBERS[j].nickname, score: scoreB },
          ],
        });
      }

      if (diffs.length > 0) {
        bandDiffs.sort((a, b) => b.diff - a.diff);
        pairs.push({
          pair: `${MEMBERS[i].nickname} vs ${MEMBERS[j].nickname}`,
          nicknames: [MEMBERS[i].nickname, MEMBERS[j].nickname],
          avgDiff: diffs.reduce((a, b) => a + b, 0) / diffs.length,
          count: diffs.length,
          topBands: bandDiffs.slice(0, 3),
        });
      }
    }
  }

  return pairs.sort((a, b) => b.avgDiff - a.avgDiff);
}

/** Count how many concerts each member was NOT in the attendees list. */
export function getMostMissedConcerts(
  concerts: Concert[]
): { nickname: string; count: number; bands: string[] }[] {
  // Build a set of all known names for each member so we match regardless of
  // whether the DB stores "Pils", "Pilsen", or "Andreas".
  const memberNames = MEMBERS.map((m) => {
    const names = new Set([
      m.nickname.toLowerCase(),
      m.dbName.toLowerCase(),
    ]);
    // Add short aliases
    const ALIASES: Record<string, string[]> = {
      Pilsen: ["pils"],
      Djen: ["djen"],
      Krem: ["krem"],
    };
    for (const a of ALIASES[m.nickname] ?? []) names.add(a);
    return { member: m, names };
  });

  return memberNames.map(({ member, names }) => {
    const missed = concerts.filter((c) => {
      if (!c.attendees || c.attendees.length === 0) return false;
      return !c.attendees.some((a) => names.has(a.toLowerCase()));
    });
    return {
      nickname: member.nickname,
      count: missed.length,
      bands: missed.map((c) => c.band_name),
    };
  }).sort((a, b) => b.count - a.count);
}

export function getHeadToHeadStats(concerts: Concert[]) {
  return {
    strictest: getStrictestScorer(concerts),
    disagreements: getMostDisagreedPairs(concerts),
    mostMissed: getMostMissedConcerts(concerts),
  };
}
