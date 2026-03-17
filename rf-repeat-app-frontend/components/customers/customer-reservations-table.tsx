import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Reservation = {
  id: number;
  visited_at: string;
};

type Props = {
  reservations: Reservation[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default function CustomerReservationsTable({ reservations }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>予約履歴</CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <p>予約履歴はありません</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>予約ID</TableHead>
                <TableHead>来店日時</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{reservation.id}</TableCell>
                  <TableCell>{formatDate(reservation.visited_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
