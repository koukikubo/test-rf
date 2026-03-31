import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rankLabel } from "@/lib/rf-master-format";

type RankSummary = {
  rank: string;
  count: number;
};

type RfRankSummaryResponse = {
  ranks: RankSummary[];
  active_total: number;
  rank_out_total: number;
  out_of_scope_total: number;
  all_customers_total: number;
};

type Props = {
  summary: RfRankSummaryResponse;
};

export default function RfRankSummaryTable({ summary }: Props) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ランク</TableHead>
              <TableHead className="text-right">人数</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {summary.ranks.map((item) => (
              <TableRow key={item.rank}>
                <TableCell>{rankLabel(item.rank)}</TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>項目</TableHead>
              <TableHead className="text-right">値</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell>稼働顧客計（A〜E）</TableCell>
              <TableCell className="text-right">
                {summary.active_total}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ランク外人数</TableCell>
              <TableCell className="text-right">
                {summary.rank_out_total}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>集計期間対象外人数</TableCell>
              <TableCell className="text-right">
                {summary.out_of_scope_total}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>全顧客計</TableCell>
              <TableCell className="text-right">
                {summary.all_customers_total}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
