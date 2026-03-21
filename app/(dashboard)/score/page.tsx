import Link from "next/link";
import { getLatestUnscoredConcert } from "@/lib/db/concerts";
import { ScoreFlow } from "@/components/score/score-flow";
import { t } from "@/lib/i18n";

export default async function ScorePage() {
  const concert = await getLatestUnscoredConcert();

  if (!concert) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-bold text-coven-text">{t("score.no_concert")}</h2>
        <p className="text-sm text-coven-text-muted">{t("score.no_concert_desc")}</p>
        <Link
          href="/dashboard"
          className="mt-2 inline-flex rounded-xl bg-coven-primary px-4 py-2.5 text-xs font-medium text-coven-bg transition hover:bg-coven-primary-hover"
        >
          {t("score.back_to_dashboard")}
        </Link>
      </div>
    );
  }

  return <ScoreFlow concert={concert} />;
}
