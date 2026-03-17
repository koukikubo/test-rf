import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type ReservationCustomer = {
  id: number;
  name: string;
};

type Reservation = {
  id: number;
  visited_at: string;
  customer: ReservationCustomer;
};

type Props = {
  reservations: Reservation[];
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default function ReservationTable({ reservations }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <CardTitle>予約一覧</CardTitle>

          <Link href="/reservations/new" className="underline">
            予約登録
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {reservations.length === 0 ? (
          <p>予約はありません</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>予約ID</TableHead>
                  <TableHead>顧客名</TableHead>
                  <TableHead>来店日時</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <Link
                        href={`/reservations/${reservation.id}`}
                        className="underline"
                      >
                        {reservation.id}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/customers/${reservation.customer.id}`}
                        className="underline"
                      >
                        {reservation.customer.name}
                      </Link>
                    </TableCell>

                    <TableCell>{formatDate(reservation.visited_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
