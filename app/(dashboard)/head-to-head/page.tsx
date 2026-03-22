import { listConcerts } from "@/lib/db/concerts";
import { getHeadToHeadStats } from "@/lib/stats/headtohead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";

export default async function HeadToHeadPage() {
  const concerts = await listConcerts();
  const { strictest, disagreements } = getHeadToHeadStats(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">
        {t("stats_h2h.title")}
      </h2>

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

      {/* Most disagreed pairs */}
      <Card>
        <CardHeader>
          <CardTitle>{t("stats_h2h.most_disagreed")}</CardTitle>
        </CardHeader>
        <CardContent>
          {disagreements.length === 0 ? (
            <p className="text-sm text-coven-text-muted">{t("stats_h2h.no_data")}</p>
          ) : (
            <ul className="divide-y divide-coven-border">
              {disagreements.map((d, i) => (
                <li key={d.pair} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-2">
                    <span className="shrink-0 text-xs tabular-nums text-coven-text-muted">{i + 1}.</span>
                    <span className="text-sm text-coven-text">{d.pair}</span>
                    <span className="shrink-0 text-xs text-coven-text-muted">
                      ({d.count} {d.count === 1 ? t("stats_h2h.concerts_count_singular") : t("stats_h2h.concerts_count_plural")})
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-coven-primary">
                    {d.avgDiff.toFixed(2)} {t("stats_h2h.avg_diff")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
