import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MatrixRow = {
  key: string;
  label: string;
};

type MatrixCol = {
  key: string;
  label: string;
  rank_key: string;
  rank_label: string;
};

type MatrixCell = {
  row_key: string;
  row_label: string;
  col_key: string;
  col_label: string;
  rank_key: string;
  rank_label: string;
  count: number;
  percentage: number;
  customer_ids: number[];
};

type RfmMatrixResponse = {
  analysis_month_label: string;
  period_start: string;
  period_end: string;
  rows: MatrixRow[];
  cols: MatrixCol[];
  cells: MatrixCell[];
};

type Props = {
  matrix: RfmMatrixResponse;
};

function findCell(
  cells: MatrixCell[],
  rowKey: string,
  colKey: string,
): MatrixCell | undefined {
  return cells.find(
    (cell) => cell.row_key === rowKey && cell.col_key === colKey,
  );
}

function calculateColumnTotals(matrix: RfmMatrixResponse) {
  return matrix.cols.map((col) => {
    const relatedCells = matrix.cells.filter(
      (cell) => cell.col_key === col.key,
    );

    const totalCount = relatedCells.reduce((sum, cell) => sum + cell.count, 0);
    const totalPercentage = relatedCells.reduce(
      (sum, cell) => sum + cell.percentage,
      0,
    );

    return {
      colKey: col.key,
      totalCount,
      totalPercentage: Number(totalPercentage.toFixed(1)),
    };
  });
}

function rankMeaning(rank: string): string {
  switch (rank) {
    case "A":
      return "超常連顧客：来店頻度が非常に高く、最優良顧客として扱う層です。";
    case "B":
      return "常連客：継続的に来店している安定顧客です。";
    case "C":
      return "通常顧客：A・B・D・E・Z・対象外のいずれにも当てはまらない顧客です。";
    case "D":
      return "休眠客：一定期間来店がなく、離反傾向がある顧客です。";
    case "E":
      return "新規顧客：直近1年以内に初回来店顧客です。";
    case "Z":
      return "ランク外：集計期間内に履歴はあるものの、優先ランク条件には当てはまらない顧客です。";
    case "OUT":
      return "対象外：集計期間の対象外となる顧客です。";
    default:
      return "";
  }
}

function rankColorClass(rank: string): string {
  switch (rank) {
    case "A":
      return "bg-green-600 text-white";
    case "B":
      return "bg-green-300";
    case "C":
      return "bg-blue-300";
    case "D":
      return "bg-yellow-300";
    case "E":
      return "bg-orange-300";
    case "Z":
      return "bg-gray-300";
    case "OUT":
      return "bg-slate-300";
    default:
      return "bg-white";
  }
}

export default function RfmMatrixCard({ matrix }: Props) {
  const columnTotals = calculateColumnTotals(matrix);
  return (
    <Card>
      <CardHeader>
        <CardTitle>RF分析表</CardTitle>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>分析月度: {matrix.analysis_month_label}</p>
          <p>
            集計期間: {matrix.period_start} 〜 {matrix.period_end}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            {[
              { key: "A", label: "A", color: "bg-green-600" },
              { key: "B", label: "B", color: "bg-green-300" },
              { key: "C", label: "C", color: "bg-blue-300" },
              { key: "D", label: "D", color: "bg-yellow-300" },
              { key: "E", label: "E", color: "bg-orange-300" },
              { key: "Z", label: "Z", color: "bg-gray-300" },
              { key: "OUT", label: "対象外", color: "bg-slate-300" },
            ].map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded px-1 py-0.5"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded ${item.color}`}
                    />
                    <span>{item.label}</span>
                  </button>
                </TooltipTrigger>

                <TooltipContent className="max-w-xs">
                  <p>{rankMeaning(item.key)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">
                  来店期間＼来店回数
                </TableHead>

                {/* 見出しをループで表示 */}
                {matrix.cols.map((col) => (
                  <TableHead key={col.key}>
                    <div>
                      <p>{col.label}</p>
                      <p className="text-xs text-muted-foreground">
                        想定ランク: {col.rank_label}
                      </p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {matrix.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.label}</TableCell>

                  {matrix.cols.map((col) => {
                    const cell = findCell(matrix.cells, row.key, col.key);

                    const count = cell?.count ?? 0;
                    const percentage = cell?.percentage ?? 0;
                    const customerIds = cell?.customer_ids ?? [];
                    const rankKey = cell?.rank_key ?? "";

                    return (
                      <TableCell
                        key={`${row.key}-${col.key}`}
                        className={rankColorClass(rankKey)}
                      >
                        {count > 0 ? (
                          <Link
                            href={`/rfm-analysis/customers?ids=${customerIds.join(",")}&row=${row.key}&col=${col.key}&{rankKey}`}
                            className="underline"
                          >
                            <div className="flex flex-col">
                              {/* 1段目: 件数 */}
                              <span>{count}</span>

                              {/* 2段目: 割合 */}
                              <span className="text-xs">({percentage}%)</span>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex flex-col">
                            <span>0</span>
                            <span className="text-xs">(0.0%)</span>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              <TableRow>
                <TableCell className="font-medium">合計</TableCell>

                {columnTotals.map((total) => (
                  <TableCell
                    key={`total-count-${total.colKey}`}
                    className="font-medium"
                  >
                    {total.totalCount}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">全体割合</TableCell>

                {columnTotals.map((total) => (
                  <TableCell
                    key={`total-percentage-${total.colKey}`}
                    className="font-medium"
                  >
                    {total.totalPercentage}%
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
