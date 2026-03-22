"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, CalendarDays, BarChart3, Users, Swords, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
const navItems = [
  { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
  { href: "/concerts", label: t("nav.concerts"), icon: CalendarDays },
  { href: "/statistics", label: t("nav.statistics"), icon: BarChart3 },
  { href: "/statistics-personal", label: t("nav.statistics_personal"), icon: Users },
  { href: "/head-to-head", label: t("nav.head_to_head"), icon: Swords },
  { href: "/insights", label: t("nav.insights"), icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  async function handleSignOut() {
    await fetch("/api/auth", { method: "DELETE" });
    setOpen(false);
    router.push("/login");
  }

  return (
    <>
      {/* Hamburger trigger — positioned by parent (Topbar) */}
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-coven-text-muted transition hover:bg-coven-active hover:text-coven-text md:hidden"
        aria-label={t("mobile.open_menu")}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Full-screen overlay — portalled to body to escape overflow:hidden */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with fade-in */}
          <div
            className="absolute inset-0 bg-coven-bg animate-in fade-in duration-200"
            onClick={close}
          />

          {/* Content with slide-down */}
          <div className="relative flex h-full flex-col px-6 py-6 animate-in slide-in-from-top-4 fade-in duration-300">
            {/* Header: logo + close */}
            <div className="flex items-center justify-between">
              <Image
                src="/branding/satans-alter-horizontal.png"
                alt="Satans Alter"
                width={1024}
                height={202}
                className="h-8 w-auto"
                priority
              />
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-coven-text-muted transition hover:bg-coven-active hover:text-coven-text"
                aria-label={t("mobile.close_menu")}
                onClick={close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="mt-12 flex-1 space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || (item.href !== "/statistics" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="block animate-in slide-in-from-left-4 fade-in duration-300"
                    style={{ animationDelay: `${(index + 1) * 50}ms`, animationFillMode: "backwards" }}
                  >
                    <span
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                        isActive
                          ? "bg-coven-primary/10 text-coven-primary"
                          : "text-coven-text-muted hover:bg-coven-active hover:text-coven-text"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <div
              className="border-t border-coven-border pt-6 animate-in fade-in duration-500"
              style={{ animationDelay: "250ms", animationFillMode: "backwards" }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full py-2.5 text-sm"
                onClick={handleSignOut}
              >
                {t("auth.sign_out")}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
