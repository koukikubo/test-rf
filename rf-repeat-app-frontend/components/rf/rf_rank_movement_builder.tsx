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
} from "../ui/tooltip";

type RankMaster = {
  key: string;
  label: string;
  description?: string;
  order?: number;
};

type MovementCell = {
  from_rank_key: string;
  from_rank_label: string;
  to_rank_key: string;
  to_rank_label: string;
  count: number;
  percentage: number;
};

type MovementTotal = {
  rank_key: string;
  rank_label: string;
  count: number;
  percentage: number;
};

type RfMovementResponse = {
  current_month_label: string;
  previous_month_label: string;
  row_ranks: RankMaster[];
  col_ranks: RankMaster[];
  cells: MovementCell[];
  row_totals: MovementTotal[];
  col_totals: MovementTotal[];
  grand_total: number;
};

type Props = {
  movement: RfMovementResponse;
};

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

function findCell(
  cells: MovementCell[],
  fromRankKey: string,
  toRankKey: string,
): MovementCell | undefined {
  return cells.find(
    (cell) =>
      cell.from_rank_key === fromRankKey && cell.to_rank_key === toRankKey,
  );
}

function findRowTotal(
  rowTotals: MovementTotal[],
  rankKey: string,
): MovementTotal | undefined {
  return rowTotals.find((row) => row.rank_key === rankKey);
}

function findColTotal(
  colTotals: MovementTotal[],
  rankKey: string,
): MovementTotal | undefined {
  return colTotals.find((col) => col.rank_key === rankKey);
}

function buildRankOrderMap(ranks: RankMaster[]): Record<string, number> {
  return ranks.reduce<Record<string, number>>((acc, rank, index) => {
    acc[rank.key] = rank.order ?? index;
    return acc;
  }, {});
}

function getMovementType(
  fromRankKey: string,
  toRankKey: string,
  rankOrderMap: Record<string, number>,
): "up" | "stay" | "down" | "unknown" {
  const fromOrder = rankOrderMap[fromRankKey];
  const toOrder = rankOrderMap[toRankKey];

  if (fromOrder === undefined || toOrder === undefined) return "unknown";
  if (toOrder < fromOrder) return "up";
  if (toOrder > fromOrder) return "down";
  return "stay";
}

function movementCellClass(
  type: "up" | "stay" | "down" | "unknown",
  count: number,
): string {
  if (count === 0) return "bg-background";
  switch (type) {
    case "up":
      return "bg-emerald-400 border border-emerald-600";
    case "stay":
      return "bg-slate-300 border border-slate-500";
    case "down":
      return "bg-rose-400 border border-rose-600";
    default:
      return "bg-background";
  }
}

function movementLabel(type: "up" | "stay" | "down" | "unknown"): string {
  switch (type) {
    case "up":
      return "ランク上昇";
    case "stay":
      return "ランク維持";
    case "down":
      return "ランク下降";
    default:
      return "判定対象外";
  }
}

export default function RfRankMovementBuilder({ movement }: Props) {
  const rankOrderMap = buildRankOrderMap(movement.row_ranks);

  return (
    <Card>
      <CardHeader>
        <CardTitle>RF変動表</CardTitle>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>行: {movement.previous_month_label}</p>
          <p>列: {movement.current_month_label}</p>
          <p>母数: {movement.grand_total}人</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground">
          前月ランクから当月ランクへ、どの顧客層がどこへ移動したかを確認できます。
        </div>

        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-emerald-400 border border-emerald-600" />
            <span>ランク上昇</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-slate-300 border border-slate-500" />
            <span>ランク維持</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded bg-rose-400 border border-rose-600" />
            <span>ランク下降</span>
          </div>
        </div>

        <TooltipProvider>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-35 font-medium">
                    <div>{movement.previous_month_label}（先月）</div>
                    <div className="text-muted-foreground">↓</div>
                    <div>{movement.current_month_label}（今月）</div>
                  </TableHead>

                  {movement.col_ranks.map((rank) => (
                    <TableHead
                      key={rank.key}
                      className="min-w-30 text-center font-medium"
                    >
                      {rank.label}
                    </TableHead>
                  ))}

                  <TableHead className="min-w-30 text-center font-medium">
                    行合計
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {movement.row_ranks.map((fromRank) => {
                  const rowTotal = findRowTotal(
                    movement.row_totals,
                    fromRank.key,
                  );

                  return (
                    <TableRow key={fromRank.key}>
                      <TableCell className="font-medium">
                        {fromRank.label}
                      </TableCell>

                      {movement.col_ranks.map((toRank) => {
                        const cell = findCell(
                          movement.cells,
                          fromRank.key,
                          toRank.key,
                        );

                        const count = cell?.count ?? 0;
                        const percentage = cell?.percentage ?? 0;
                        const type = getMovementType(
                          fromRank.key,
                          toRank.key,
                          rankOrderMap,
                        );

                        return (
                          <TableCell
                            key={`${fromRank.key}-${toRank.key}`}
                            className={`text-center align-middle ${movementCellClass(type, count)}`}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="w-full rounded px-2 py-2 text-center"
                                >
                                  <div className="font-medium">{count}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ({formatPercentage(percentage)})
                                  </div>
                                </button>
                              </TooltipTrigger>

                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1 text-sm">
                                  <p>
                                    {fromRank.label} → {toRank.label}
                                  </p>
                                  <p>{movementLabel(type)}</p>
                                  <p>
                                    {count}人 / {formatPercentage(percentage)}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        );
                      })}

                      <TableCell className="text-center">
                        <div className="font-medium">
                          {rowTotal?.count ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ({formatPercentage(rowTotal?.percentage ?? 0)})
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow className="bg-slate-50">
                  <TableCell className="font-semibold">合計</TableCell>

                  {movement.col_ranks.map((rank) => {
                    const colTotal = findColTotal(
                      movement.col_totals,
                      rank.key,
                    );

                    return (
                      <TableCell
                        key={`total-${rank.key}`}
                        className="text-center"
                      >
                        <div className="font-semibold">
                          {colTotal?.count ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ({formatPercentage(colTotal?.percentage ?? 0)})
                        </div>
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-center">
                    <div className="font-semibold">{movement.grand_total}</div>
                    <div className="text-xs text-muted-foreground">
                      (100.0%)
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
