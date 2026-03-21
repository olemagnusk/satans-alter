"use server";

import { revalidatePath } from "next/cache";
import { setNextConcertDate } from "@/lib/db/settings";

export async function setNextConcertDateAction(date: string) {
  await setNextConcertDate(date);
  revalidatePath("/dashboard");
  return { success: true };
}
