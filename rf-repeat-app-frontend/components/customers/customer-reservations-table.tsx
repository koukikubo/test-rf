import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/rf-master-format";

type Reservation = {
  id: number;
  visited_at: string;
};

type Props = {
  reservations: Reservation[];
};

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
                  <TableCell>
                    {formatDateTime(reservation.visited_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
