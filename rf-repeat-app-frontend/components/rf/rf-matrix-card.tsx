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
import { rankColor, rankLabel, rankMeaning } from "@/lib/rf-master-format";

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

type RfMatrixResponse = {
  analysis_month_label: string;
  period_start: string;
  period_end: string;
  rows: MatrixRow[];
  cols: MatrixCol[];
  cells: MatrixCell[];
};

type Props = {
  matrix: RfMatrixResponse;
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

function calculateColumnTotals(matrix: RfMatrixResponse) {
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

export default function RfMatrixCard({ matrix }: Props) {
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
            {["A", "B", "C", "D", "E", "Z", "OUT"].map((rank) => (
              <Tooltip key={rank}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded px-1 py-0.5"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded ${rankColor(rank)}`}
                    />
                    <span>{rankLabel(rank)}</span>
                  </button>
                </TooltipTrigger>

                <TooltipContent className="max-w-xs">
                  <p>{rankMeaning(rank)}</p>
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
                        className={rankColor(rankKey)}
                      >
                        {count > 0 ? (
                          <Link
                            href={`/rf-analysis/customers?ids=${customerIds.join(",")}&row=${row.key}&col=${col.key}&{rankKey}`}
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
