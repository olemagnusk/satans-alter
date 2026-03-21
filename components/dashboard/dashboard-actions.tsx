"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConcertForm } from "@/components/concerts/concert-form";
import { t } from "@/lib/i18n";

export function DashboardActions() {
  const router = useRouter();
  const [isNewConcertOpen, setIsNewConcertOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsNewConcertOpen(true)}
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-coven-border-strong bg-coven-primary px-3 py-3 text-left shadow-sm transition hover:border-coven-primary-hover hover:bg-coven-primary-hover sm:px-4"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-coven-bg">{t("dashboard.new_concert")}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coven-bg text-coven-primary transition group-hover:bg-coven-bg/90">
            <PlusCircle className="h-4 w-4" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => router.push("/score")}
          className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-coven-border-strong bg-coven-primary px-3 py-3 text-left shadow-sm transition hover:border-coven-primary-hover hover:bg-coven-primary-hover sm:px-4"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-coven-bg">
              {t("dashboard.add_score")}
            </p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coven-bg text-coven-primary transition group-hover:bg-coven-bg/90">
            <Star className="h-4 w-4" />
          </div>
        </button>
      </div>

      {isNewConcertOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-xl border border-coven-border bg-coven-surface p-4 shadow-2xl sm:mx-4 sm:max-w-2xl sm:rounded-xl sm:p-6">
            <button
              type="button"
              className="absolute right-4 top-4 text-coven-text-muted hover:text-coven-text"
              onClick={() => setIsNewConcertOpen(false)}
            >
              <span className="sr-only">{t("dashboard.close")}</span>
              ✕
            </button>
            <h2 className="mb-4 font-heading text-lg font-semibold tracking-tight text-coven-text">
              {t("dashboard.new_concert")}
            </h2>
            <ConcertForm />
          </div>
        </div>
      )}
    </>
  );
}

