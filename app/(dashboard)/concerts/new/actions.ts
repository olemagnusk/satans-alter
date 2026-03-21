"use server";

import { revalidatePath } from "next/cache";
import { concertInputSchema, concertUpdateSchema, type ConcertInput, type ConcertUpdateInput } from "@/lib/validation/concert";
import { createConcert, updateConcert, deleteConcert } from "@/lib/db/concerts";

export async function createConcertAction(input: ConcertInput) {
  const parsed = concertInputSchema.parse(input);
  await createConcert(parsed, "sa");
  revalidatePath("/concerts");
  return { success: true };
}

export async function updateConcertAction(id: string, input: ConcertUpdateInput) {
  const parsed = concertUpdateSchema.parse(input);
  await updateConcert(id, parsed);
  revalidatePath("/concerts");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/insights");
  return { success: true };
}

export async function deleteConcertAction(id: string) {
  await deleteConcert(id);
  revalidatePath("/concerts");
  revalidatePath("/dashboard");
  revalidatePath("/statistics");
  revalidatePath("/insights");
  return { success: true };
}
