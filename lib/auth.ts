import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = "sa_session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === "authenticated" ? { user: { email: "sa" } } : null;
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session.user;
}
