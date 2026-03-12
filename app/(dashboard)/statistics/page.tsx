import { listConcerts } from "@/lib/db/concerts";
import {
  getAverageMainScore,
  getTotals,
  getTopBandsByScore
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StatisticsPage() {
  const concerts = await listConcerts();
  const totals = getTotals(concerts);
  const avgMain = getAverageMainScore(concerts);
  const topBands = getTopBandsByScore(concerts);

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">Statistics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total concerts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totals.totalConcerts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total attendees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totals.totalAttendees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average main score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {avgMain != null ? avgMain.toFixed(1) : "–"}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top bands by average score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-coven-text-soft">
          {topBands.length === 0 ? (
            <p>No scored concerts yet.</p>
          ) : (
            <ul className="space-y-1">
              {topBands.map((band) => (
                <li key={band.band} className="flex justify-between">
                  <span>{band.band}</span>
                  <span className="text-coven-text-muted">
                    {band.average.toFixed(2)} ({band.count})
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

