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
                <TableHead>来店期間＼来店回数</TableHead>
                {matrix.cols.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {matrix.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>{row.label}</TableCell>

                  {matrix.cols.map((col) => {
                    const cell = findCell(matrix.cells, row.key, col.key);

                    return (
                      <TableCell key={`${row.key}-${col.key}`}>
                        <Link
                          href={`/rfm-analysis/customers?ids=${(cell?.customer_ids ?? []).join(",")}&row=${row.key}&col=${col.key}`}
                          className="underline"
                        >
                          {cell?.count ?? 0}
                        </Link>
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
