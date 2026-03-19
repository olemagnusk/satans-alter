import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const FAKE_EMAIL = "sa";
const FAKE_PASSWORD = "sa";
const COOKIE_NAME = "sa_session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email !== FAKE_EMAIL || password !== FAKE_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
