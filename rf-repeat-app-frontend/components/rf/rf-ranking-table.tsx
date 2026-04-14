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
import { formatDate } from "@/lib/rf-master-format";

type RfRankingRow = {
  customer: {
    id: number;
    name: string;
  };
  id: number;
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
};

type Props = {
  rfRankingRows: RfRankingRow[];
};

export default function RfRankingTable({ rfRankingRows }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFランキング一覧</CardTitle>
      </CardHeader>

      <CardContent>
        {rfRankingRows.length === 0 ? (
          <p>RFデータはありません</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顧客名</TableHead>
                  <TableHead>来店回数</TableHead>
                  <TableHead>最終来店日</TableHead>
                  <TableHead>ランク</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rfRankingRows.map((row) => (
                  <TableRow key={row.customer.id}>
                    <TableCell>
                      <Link
                        href={`/customers/${row.customer.id}`}
                        className="underline"
                      >
                        {row.customer.name}
                      </Link>
                    </TableCell>

                    <TableCell>{row.visit_count}</TableCell>
                    <TableCell>{formatDate(row.last_visit_at)}</TableCell>
                    <TableCell>{row.rank === "OUT" ? "" : row.rank}</TableCell>
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
