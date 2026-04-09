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
import { rankColor } from "@/lib/rf-master-format";
import { KpiGrid } from "../kpi/kpi_grid";
import Link from "next/link";

type TransitionRow = {
  rank_key: string;
  rank_label: string;
  previous_count: number;
  current_count: number;
  diff_count: number;
  diff_rate: number | null;
  current_percentage: number;
};

type RfTransitionResponse = {
  current_month_label: string;
  previous_month_label: string;
  rows: TransitionRow[];
};

type Kpi = {
  title: string;
  value: string | number;
  diff?: number | null;
};

type Props = {
  transition: RfTransitionResponse;
  kpis: Kpi[];
  rankMaster: RankMaster[];
};

type RankMaster = {
  key: string;
  label: string;
  description: string;
  order: number;
};

function diffTextColor(diffCount: number): string {
  if (diffCount > 0) return "text-blue-600";
  if (diffCount < 0) return "text-red-600";
  return "text-foreground";
}

function formatDiffCount(diffCount: number): string {
  return `${diffCount > 0 ? "+" : ""}${diffCount}`;
}

function formatDiffRate(diffRate: number | null): string {
  if (diffRate === null) return "—";
  return `${diffRate > 0 ? "+" : ""}${diffRate}%`;
}

export default function RfTransitionCard({
  transition,
  kpis,
  rankMaster,
}: Props) {
  const rankMap = Object.fromEntries(rankMaster.map((r) => [r.key, r]));

  return (
    <Card>
      <KpiGrid kpis={kpis} />
      <CardHeader>
        <CardTitle>RF推移表</CardTitle>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>当月: {transition.current_month_label}</p>
          <p>比較対象: {transition.previous_month_label}</p>
        </div>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            {transition.rows.map((row) => (
              <Tooltip key={row.rank_key || "out_of_scope"}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded px-1 py-0.5"
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded ${rankColor(row.rank_key)}`}
                    />
                    <span>
                      {rankMap[row.rank_label]?.label ?? row.rank_label}
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent className="max-w-xs">
                  <p>{rankMap[row.rank_key]?.description ?? ""}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">ランク</TableHead>
                <TableHead className="text-right">
                  {transition.previous_month_label}
                </TableHead>
                <TableHead className="text-right">
                  {transition.current_month_label}
                </TableHead>
                <TableHead className="text-right">増減人数</TableHead>
                <TableHead className="text-right">増減率</TableHead>
                <TableHead className="text-right">当月構成比</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transition.rows.map((row) => (
                <TableRow key={row.rank_key || "out_of_scope"}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/rf-target-customers?month=${encodeURIComponent(
                          transition.current_month_label,
                        )}&rank=${encodeURIComponent(row.rank_key)}`}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded ${rankColor(row.rank_key)}`}
                        />
                        <span>
                          {rankMap[row.rank_key]?.label ?? row.rank_label}
                        </span>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.previous_count}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.current_count}
                  </TableCell>
                  <TableCell
                    className={`text-right ${diffTextColor(row.diff_count)}`}
                  >
                    {formatDiffCount(row.diff_count)}
                  </TableCell>
                  <TableCell
                    className={`text-right ${diffTextColor(row.diff_count)}`}
                  >
                    {formatDiffRate(row.diff_rate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.current_percentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
