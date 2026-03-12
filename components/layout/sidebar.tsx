"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/concerts", label: "Concerts" },
  { href: "/concerts/new", label: "New Concert" },
  { href: "/statistics", label: "Statistics" },
  { href: "/insights", label: "Insights" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-col border-r border-coven-border bg-coven-sidebar px-3 py-4 md:flex">
      <div className="mb-3 px-2 pt-1.5">
        <h1 className="_font-black-dread text-[34px] leading-none tracking-[0.08em] text-coven-text">
          SATANS ALTER
        </h1>
      </div>
      <nav className="mt-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border border-coven-border-strong bg-coven-active text-coven-text"
                    : "text-coven-text-muted hover:bg-coven-active hover:text-coven-text"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
