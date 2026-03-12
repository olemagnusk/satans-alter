import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  // When authenticated, send users to the main dashboard route.
  redirect("/concerts");
}


