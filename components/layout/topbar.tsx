"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL_MAP: Record<string, string> = {
  "": "Dashboard",
  concerts: "Concerts",
  statistics: "Statistics",
  insights: "Insights",
  login: "Login"
};

export function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { href: "/", label: "Satans Alter" },
    ...segments.map((seg, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = LABEL_MAP[seg] ?? seg.replace(/-/g, " ");
      return { href, label };
    })
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-coven-border bg-coven-bg/60 px-4 backdrop-blur md:px-10">
      <div className="flex items-center gap-2 text-sm text-coven-text-muted">
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1 text-sm text-coven-text-muted md:flex"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <span className="text-[10px] text-coven-text-muted">/</span>
                )}
                {isLast ? (
                  <span className="text-[13px] font-medium text-coven-text-soft">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[12px] uppercase tracking-[0.18em] text-coven-text-muted hover:text-coven-text-soft"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 text-xs text-coven-text-soft">
        {/* Reserved for future filters / actions */}
      </div>
    </header>
  );
}
