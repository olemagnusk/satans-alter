import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConcertForm } from "@/components/concerts/concert-form";

export default function NewConcertPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="font-heading text-lg font-semibold tracking-tight">New Concert</h2>
      <Card>
        <CardHeader>
          <CardTitle>New Concert Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <ConcertForm withImages />
        </CardContent>
      </Card>
    </div>
  );
}

