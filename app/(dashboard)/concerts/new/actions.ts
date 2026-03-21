"use server";

import { revalidatePath } from "next/cache";
import { concertInputSchema, type ConcertInput } from "@/lib/validation/concert";
import { createConcert } from "@/lib/db/concerts";

export async function createConcertAction(input: ConcertInput) {
  const parsed = concertInputSchema.parse(input);
  await createConcert(parsed, "sa");
  revalidatePath("/concerts");
  return { success: true };
}
