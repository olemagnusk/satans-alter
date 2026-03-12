"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-coven-border bg-coven-bg/60 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center gap-2 text-sm text-coven-text-muted">
        <span className="hidden text-xs uppercase tracking-[0.2em] text-coven-text-muted md:inline">
          Concert Dashboard
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
