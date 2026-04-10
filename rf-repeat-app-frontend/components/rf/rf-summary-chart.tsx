"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { rankLabel } from "@/lib/rf-master-format";

type RankSummary = {
  rank: string;
  count: number;
};

type Props = {
  ranks: RankSummary[];
};

const chartConfig = {
  count: {
    label: "人数",
    color: "var(--chart-1)",
  },
  label: {
    label: "ラベル",
    color: "var(--background)",
  },
} satisfies ChartConfig;

function rankFillColor(rank: string): string {
  switch (rank) {
    case "A":
      return "var(--chart-1)";
    case "B":
      return "var(--chart-2)";
    case "C":
      return "var(--chart-3)";
    case "D":
      return "var(--chart-4)";
    case "E":
      return "var(--chart-5)";
    case "F":
      return "hsl(var(--muted))";
    case "":
    case "OUT":
      return "hsl(var(--muted-foreground) / 0.35)";
    default:
      return "hsl(var(--muted))";
  }
}

export default function RfSummaryChart({ ranks }: Props) {
  const chartData = ranks.map((item) => ({
    rank: item.rank,
    rankLabel: item.rank === "" ? "対象外" : rankLabel(item.rank),
    count: item.count,
    fill: rankFillColor(item.rank),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>RF統計グラフ</CardTitle>
        <CardDescription>
          ランク別の顧客人数を横棒グラフで表示しています
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 24, right: 24 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="rankLabel"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={80}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Bar dataKey="count" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.rankLabel} fill={entry.fill} />
              ))}

              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
