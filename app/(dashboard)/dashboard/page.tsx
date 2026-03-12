import { listConcerts } from "@/lib/db/concerts";
import {
  getAverageMainScore,
  getMostFrequentVenue,
  getTotals
} from "@/lib/stats/concerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertTable } from "@/components/concerts/concert-table";

export default async function DashboardPage() {
  const concerts = await listConcerts();
  const totals = getTotals(concerts);
  const averageMain = getAverageMainScore(concerts);
  const topVenue = getMostFrequentVenue(concerts);

  const recent = concerts.slice(0, 5);

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        Dashboard
      </h2>
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
            <CardTitle>Average main score</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {averageMain != null ? averageMain.toFixed(1) : "–"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most frequent venue</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-coven-text-soft">
            {topVenue ?? "No data yet"}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent concerts</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-coven-text-soft">
          {recent.length === 0 ? (
            <p>No concerts yet. Use the New Concert page to add your first.</p>
          ) : (
            <ConcertTable concerts={recent} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

