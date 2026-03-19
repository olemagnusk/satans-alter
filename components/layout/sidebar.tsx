"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LayoutDashboard, CalendarDays, BarChart3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/concerts", label: "Concerts", icon: CalendarDays },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Sparkles }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function handleSignOut() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <aside className="hidden w-64 flex-col justify-between border-r border-coven-border bg-coven-sidebar px-4 py-6 md:flex">
      <div>
        <div className="mb-6 px-1 pt-1.5">
          <img
            src="/branding/satans-alter-horizontal.png"
            alt="Satans Alter"
            className="h-[2.8rem] w-auto"
          />
        </div>
        <nav className="mt-4 space-y-3.5">
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
              sa
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

    </aside>
  );
}
