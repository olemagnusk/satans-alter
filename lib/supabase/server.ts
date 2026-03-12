import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type SupabaseServerClient = ReturnType<typeof createServerClient> | null;

export async function createSupabaseServerClient(): Promise<SupabaseServerClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase env vars are not configured, allow the app to keep running
  // and let callers handle the "no client" case (e.g. by treating as logged-out).
  if (!url || !key) {
    console.warn(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      }
    }
  });
}

