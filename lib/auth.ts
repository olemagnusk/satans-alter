import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { findUserByEmail } from "@/lib/users";

const COOKIE_NAME = "sa_session";

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return null;
  const user = findUserByEmail(session.value);
  if (!user) return null;
  return { user: { email: user.email, nickname: user.nickname } };
}

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session.user;
}
