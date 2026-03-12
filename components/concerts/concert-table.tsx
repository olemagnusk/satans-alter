import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableCell
} from "@/components/ui/table";
import type { Concert } from "@/lib/validation/concert";

type ConcertTableProps = {
  concerts: Concert[];
};

export function ConcertTable({ concerts }: ConcertTableProps) {
  if (!concerts.length) {
    return (
      <p className="text-sm text-coven-text-muted">
        No concerts yet. Use the New Concert page to add your first entry.
      </p>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>Band</TableHeadCell>
          <TableHeadCell>Support</TableHeadCell>
          <TableHeadCell>Venue</TableHeadCell>
          <TableHeadCell>Main score</TableHeadCell>
          <TableHeadCell>Support scores</TableHeadCell>
          <TableHeadCell>Attendees</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {concerts.map((concert) => (
          <TableRow key={concert.id}>
            <TableCell>{concert.date}</TableCell>
            <TableCell>{concert.band_name}</TableCell>
            <TableCell>
              {[concert.support_band_1, concert.support_band_2]
                .filter(Boolean)
                .join(", ")}
            </TableCell>
            <TableCell>{concert.venue}</TableCell>
            <TableCell>
              {concert.score_main != null ? concert.score_main : "–"}
            </TableCell>
            <TableCell>
              {[
                concert.score_support_1 ?? "–",
                concert.score_support_2 ?? "–"
              ].join(" / ")}
            </TableCell>
            <TableCell>
              {concert.attendees != null ? concert.attendees : "–"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

