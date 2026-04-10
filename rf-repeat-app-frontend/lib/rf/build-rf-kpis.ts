export type Kpi = {
  title: string;
  value: string | number;
  diff?: number | null;
};

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

export function buildRfKpis(transition: RfTransitionResponse): Kpi[] {
  const topRanks = ["A", "B", "C"];
  const lowRanks = ["E", "Z", "out_of_scope"];

  const topCurrentCount = transition.rows
    .filter((row) => topRanks.includes(row.rank_key))
    .reduce((sum, row) => sum + row.current_count, 0);

  const topPreviousCount = transition.rows
    .filter((row) => topRanks.includes(row.rank_key))
    .reduce((sum, row) => sum + row.previous_count, 0);

  const lowCurrentCount = transition.rows
    .filter((row) => lowRanks.includes(row.rank_key))
    .reduce((sum, row) => sum + row.current_count, 0);

  const lowPreviousCount = transition.rows
    .filter((row) => lowRanks.includes(row.rank_key))
    .reduce((sum, row) => sum + row.previous_count, 0);

  const currentTotal = transition.rows.reduce(
    (sum, row) => sum + row.current_count,
    0,
  );
  const previousTotal = transition.rows.reduce(
    (sum, row) => sum + row.previous_count,
    0,
  );

  const topCurrentRate =
    currentTotal === 0 ? 0 : (topCurrentCount / currentTotal) * 100;
  const topPreviousRate =
    previousTotal === 0 ? 0 : (topPreviousCount / previousTotal) * 100;

  const lowCurrentRate =
    currentTotal === 0 ? 0 : (lowCurrentCount / currentTotal) * 100;
  const lowPreviousRate =
    previousTotal === 0 ? 0 : (lowPreviousCount / previousTotal) * 100;

  const kpis: Kpi[] = [
    {
      title: "上位ランク比率",
      value: `${topCurrentRate.toFixed(1)}%`,
      diff: Number((topCurrentRate - topPreviousRate).toFixed(1)),
    },
    {
      title: "下位ランク比率",
      value: `${lowCurrentRate.toFixed(1)}%`,
      diff: Number((lowCurrentRate - lowPreviousRate).toFixed(1)),
    },
    {
      title: "Cランク増減",
      value:
        transition.rows.find((row) => row.rank_key === "C")?.current_count ?? 0,
      diff:
        transition.rows.find((row) => row.rank_key === "C")?.diff_count ?? 0,
    },
  ];
  return kpis;
}
