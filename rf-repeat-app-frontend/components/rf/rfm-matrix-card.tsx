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
};

type MatrixCell = {
  row_key: string;
  row_label: string;
  col_key: string;
  col_label: string;
  count: number;
  customer_ids: number[];
};

type RfmMatrixResponse = {
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

function rankBaseColorClass(rank: string): string {
  switch (rank) {
    case "A":
      return "bg-green-100";
    case "B":
      return "bg-green-50";
    case "C":
      return "bg-blue-50";
    case "D":
      return "bg-yellow-50";
    case "E":
      return "bg-orange-50";
    case "F":
      return "bg-gray-100";
    case "OUT":
      return "bg-slate-50";
    default:
      return "";
  }
}

function cellColorClass(rowKey: string, colKey: string): string {
  if (rowKey === "recent" && colKey === "A") {
    return "bg-green-600 text-white";
  }

  if (rowKey === "recent" && colKey === "B") {
    return "bg-green-300";
  }

  if (rowKey === "recent" && colKey === "E") {
    return "bg-orange-300";
  }

  if (rowKey === "middle" && colKey === "C") {
    return "bg-blue-300";
  }

  if (rowKey === "old" && colKey === "D") {
    return "bg-yellow-300";
  }

  if (rowKey === "inactive" && colKey === "D") {
    return "bg-gray-300";
  }

  if (rowKey === "out_of_scope" && colKey === "GZ") {
    return "bg-slate-300";
  }
  if (rowKey === "out_of_scope" && colKey === "OUT") {
    return "bg-slate-300";
  }

  return rankBaseColorClass(colKey);
}

export default function RfmMatrixCard({ matrix }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFM分析表</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">来店期間＼ランク</TableHead>
                {matrix.cols.map((col) => (
                  <TableHead
                    key={col.key}
                    className={rankBaseColorClass(col.key)}
                  >
                    {col.label}
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
                    const customerIds = cell?.customer_ids ?? [];

                    return (
                      <TableCell
                        key={`${row.key}-${col.key}`}
                        className={cellColorClass(row.key, col.key)}
                      >
                        {count > 0 ? (
                          <Link
                            href={`/rfm-analysis/customers?ids=${customerIds.join(",")}&row=${row.key}&col=${col.key}`}
                            className="underline"
                          >
                            {count}
                          </Link>
                        ) : (
                          <span>0</span>
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
