"use server";

import { revalidatePath } from "next/cache";
import {
  getLatestUnscoredConcert,
  submitMemberScores,
  getScoreStatus,
  revealScores,
} from "@/lib/db/concerts";
import type { Concert } from "@/lib/validation/concert";

export async function getUnscoredConcertAction(): Promise<Concert | null> {
  return getLatestUnscoredConcert();
}

export async function submitScoresAction(
  concertId: string,
  member: "andreas" | "dennis" | "magnus",
  mainScore: number,
  supportScore: number | null
): Promise<{ success: boolean }> {
  if (mainScore < 1 || mainScore > 6) throw new Error("Invalid main score");
  if (supportScore != null && (supportScore < 1 || supportScore > 6))
    throw new Error("Invalid support score");

  await submitMemberScores(concertId, member, mainScore, supportScore);
  return { success: true };
}

export async function getScoreStatusAction(concertId: string): Promise<{
  submitted: { andreas: boolean; dennis: boolean; magnus: boolean };
  allSubmitted: boolean;
  revealed: boolean;
  concert: Concert;
}> {
  const status = await getScoreStatus(concertId);
  return {
    ...status,
    revealed: status.concert.scores_revealed,
  };
}

export async function revealScoresAction(concertId: string): Promise<{ success: boolean }> {
  await revealScores(concertId);
  revalidatePath("/concerts");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/insights");
  return { success: true };
}
