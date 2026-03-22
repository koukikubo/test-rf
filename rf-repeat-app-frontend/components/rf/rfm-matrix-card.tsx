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
    case "F":
      return "bg-gray-300";
    case "OUT":
      return "bg-slate-300";
    default:
      return "bg-white";
  }
}

export default function RfmMatrixCard({ matrix }: Props) {
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
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-green-600" />
            <span>A</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-green-300" />
            <span>B</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-blue-300" />
            <span>C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-yellow-300" />
            <span>D</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-orange-300" />
            <span>E</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-gray-300" />
            <span>Z</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-slate-300" />
            <span>対象外</span>
          </div>
        </div>

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
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
