"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Sparkles,
  PlusCircle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ConcertForm } from "@/components/concerts/concert-form";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/concerts", label: "Concerts", icon: CalendarDays },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Sparkles }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isNewConcertOpen, setIsNewConcertOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="hidden w-64 flex-col justify-between border-r border-coven-border bg-coven-sidebar px-4 py-6 md:flex">
      <div>
        <div className="mb-6 px-1 pt-1.5">
          <h1 className="_font-black-dread text-[34px] leading-none tracking-[0.08em] text-coven-text">
            SATANS ALTER
          </h1>
        </div>
        <div className="space-y-2">
          <Button
            className="mt-2 w-full justify-center gap-2 bg-coven-primary text-coven-bg hover:bg-coven-primary-hover"
            size="sm"
            onClick={() => setIsNewConcertOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">New concert</span>
          </Button>
          <Button
            className="w-full justify-center gap-2 border-coven-border bg-transparent text-coven-text hover:bg-coven-active"
            variant="outline"
            size="sm"
          >
            <span className="text-sm font-medium">Add concert score</span>
          </Button>
        </div>
        <nav className="mt-7 space-y-3.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border border-coven-border-strong bg-coven-active text-coven-text"
                      : "text-coven-text-muted hover:bg-coven-active hover:text-coven-text"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 border-t border-coven-border pt-4 text-xs text-coven-text-muted">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-coven-text-soft">
              Signed in
            </p>
            <p className="text-xs text-coven-text">
              {email ?? "Session user"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-[11px]"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </div>

      {isNewConcertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-coven-border bg-coven-surface p-6 shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 text-coven-text-muted hover:text-coven-text"
              onClick={() => setIsNewConcertOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="mb-4 font-heading text-lg font-semibold tracking-tight text-coven-text">
              New concert
            </h2>
            <ConcertForm />
          </div>
        </div>
      )}
    </aside>
  );
}
