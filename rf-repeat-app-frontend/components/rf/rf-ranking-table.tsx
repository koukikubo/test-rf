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

type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
  customer: {
    id: number;
    name: string;
  };
};

// 日付を日本語形式で表示するための関数
function formatDate(dateString: string | null) {
  if (!dateString) {
    return "来店履歴なし";
  }

  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP");
}

type Props = {
  rfScores: RfScore[];
};

export default function RfRankingTable({ rfScores }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFランキング一覧</CardTitle>
      </CardHeader>

      <CardContent>
        {rfScores.length === 0 ? (
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
                {rfScores.map((score) => (
                  <TableRow key={score.customer.id}>
                    <TableCell>
                      <Link
                        href={`/customers/${score.customer.id}`}
                        className="underline"
                      >
                        {score.customer.name}
                      </Link>
                    </TableCell>

                    <TableCell>{score.visit_count}</TableCell>
                    <TableCell>{formatDate(score.last_visit_at)}</TableCell>
                    <TableCell>{score.rank}</TableCell>
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
