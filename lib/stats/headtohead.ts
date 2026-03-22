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

/** For each pair of members, compute average absolute score difference. */
export function getMostDisagreedPairs(
  concerts: Concert[]
): { pair: string; avgDiff: number; count: number }[] {
  const pairs: { pair: string; avgDiff: number; count: number }[] = [];

  for (let i = 0; i < MEMBERS.length; i++) {
    for (let j = i + 1; j < MEMBERS.length; j++) {
      const keyA = mainKey(MEMBERS[i].dbName);
      const keyB = mainKey(MEMBERS[j].dbName);
      const diffs: number[] = [];

      for (const c of concerts) {
        if (!c.scores_revealed || c[keyA] == null || c[keyB] == null) continue;
        diffs.push(Math.abs((c[keyA] as number) - (c[keyB] as number)));
      }

      if (diffs.length > 0) {
        pairs.push({
          pair: `${MEMBERS[i].nickname} vs ${MEMBERS[j].nickname}`,
          avgDiff: diffs.reduce((a, b) => a + b, 0) / diffs.length,
          count: diffs.length,
        });
      }
    }
  }

  return pairs.sort((a, b) => b.avgDiff - a.avgDiff);
}

export function getHeadToHeadStats(concerts: Concert[]) {
  return {
    strictest: getStrictestScorer(concerts),
    disagreements: getMostDisagreedPairs(concerts),
  };
}
