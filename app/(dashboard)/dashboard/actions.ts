"use server";

import { revalidatePath } from "next/cache";
import { setNextConcertDate, setNextConcertBooker } from "@/lib/db/settings";

export async function setNextConcertDateAction(date: string) {
  await setNextConcertDate(date);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function setNextConcertBookerAction(booker: string) {
  await setNextConcertBooker(booker);
  revalidatePath("/dashboard");
  return { success: true };
}
