import { listConcerts } from "@/lib/db/concerts";
import { getHeadToHeadStats } from "@/lib/stats/headtohead";
import { getBookerScore } from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisagreementList } from "@/components/statistics/disagreement-list";
import { t } from "@/lib/i18n";

export default async function HeadToHeadPage() {
  const concerts = await listConcerts();
  const { strictest, disagreements, mostMissed } = getHeadToHeadStats(concerts);
  const bookerScores = getBookerScore(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("stats_h2h.title")}
      </h2>

      {/* Booker score — KPI cards */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats.booker_score")}</CardTitle>
        </CardHeader>
        <CardContent>
          {bookerScores.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {bookerScores.map((b, i) => (
                <div
                  key={b.booker}
                  className={`rounded-lg border p-3 text-center ${
                    i === 0
                      ? "border-coven-primary/30 bg-coven-primary/5"
                      : "border-coven-border bg-coven-card"
                  }`}
                >
                  <p className="text-sm font-medium text-coven-text">{b.booker}</p>
                  <p className={`text-2xl font-bold tabular-nums ${i === 0 ? "text-coven-primary" : "text-coven-text"}`}>
                    {b.average.toFixed(1)}
                  </p>
                  <p className="text-[11px] text-coven-text-muted">
                    {b.count} {b.count === 1 ? t("stats_h2h.concerts_count_singular") : t("stats_h2h.concerts_count_plural")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most missed concerts — KPI cards */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats_h2h.most_missed")}</CardTitle>
        </CardHeader>
        <CardContent>
          {mostMissed.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {mostMissed.map((m, i) => (
                <div
                  key={m.nickname}
                  className={`rounded-lg border p-3 text-center ${
                    i === 0
                      ? "border-coven-primary/30 bg-coven-primary/5"
                      : "border-coven-border bg-coven-card"
                  }`}
                >
                  <p className="text-sm font-medium text-coven-text">{m.nickname}</p>
                  <p className={`text-2xl font-bold tabular-nums ${i === 0 ? "text-coven-primary" : "text-coven-text"}`}>
                    {m.count}
                  </p>
                  <p className="text-[11px] text-coven-text-muted">
                    {m.count === 1 ? t("stats_h2h.missed_count_singular") : t("stats_h2h.missed_count_plural")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strictest scorer */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats_h2h.strictest")}</CardTitle>
        </CardHeader>
        <CardContent>
          {strictest.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <ul className="divide-y divide-coven-border">
              {strictest.map((m, i) => (
                <li key={m.nickname} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
                    <span className="text-sm text-coven-text">{m.nickname}</span>
                    <span className="shrink-0 text-xs text-coven-text-muted">
                      ({m.count} {m.count === 1 ? t("stats_h2h.concerts_count_singular") : t("stats_h2h.concerts_count_plural")})
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-coven-primary">
                    {m.average.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Kindest scorer (same data, reversed) */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats_h2h.kindest")}</CardTitle>
        </CardHeader>
        <CardContent>
          {strictest.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <ul className="divide-y divide-coven-border">
              {[...strictest].reverse().map((m, i) => (
                <li key={m.nickname} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
                    <span className="text-sm text-coven-text">{m.nickname}</span>
                    <span className="shrink-0 text-xs text-coven-text-muted">
                      ({m.count} {m.count === 1 ? t("stats_h2h.concerts_count_singular") : t("stats_h2h.concerts_count_plural")})
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-coven-primary">
                    {m.average.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Most disagreed pairs — expandable with top bands */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats_h2h.most_disagreed")}</CardTitle>
        </CardHeader>
        <CardContent>
          {disagreements.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <DisagreementList disagreements={disagreements} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
