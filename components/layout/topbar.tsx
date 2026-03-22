"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { t } from "@/lib/i18n";

const LABEL_MAP: Record<string, string> = {
  "": t("nav.dashboard"),
  concerts: t("nav.concerts"),
  statistics: t("nav.statistics"),
  "statistics-personal": t("nav.statistics_personal"),
  "head-to-head": t("nav.head_to_head"),
  login: t("nav.login"),
};

export function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { href: "/dashboard", label: "Satans Alter" },
    ...segments.map((seg, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = LABEL_MAP[seg] ?? seg.replace(/-/g, " ");
      return { href, label };
    })
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-coven-border bg-coven-bg/60 px-4 backdrop-blur md:h-16 md:px-10">
      {/* Mobile: logo left | Desktop: breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden">
          <Image
            src="/branding/satans-alter-horizontal.png"
            alt="Satans Alter"
            width={1024}
            height={202}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav
          aria-label="Breadcrumb"
          className="hidden items-center gap-1 text-sm text-coven-text-muted md:flex"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <div key={`${index}-${crumb.href}`} className="flex items-center gap-1">
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

      {/* Mobile: hamburger right | Desktop: reserved space */}
      <div className="flex items-center gap-3">
        <MobileNav />
      </div>
    </header>
  );
}
