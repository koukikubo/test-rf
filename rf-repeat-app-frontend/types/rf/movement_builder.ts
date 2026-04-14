export type RankKey = "A" | "B" | "C" | "D" | "E" | "Z" | "N";

export type MovementCell = {
  from_rank_key: string;
  from_rank_label: string;
  to_rank_key: string;
  to_rank_label: string;
  count: number;
  percentage: number;
  customer_ids: number[];
};

export type MovementTotal = {
  rank_key: RankKey;
  rank_label: string;
  count: number;
  percentage: number;
};

export type RankMaster = {
  key: string;
  label: string;
  description: string;
  order: number;
};

export type RfMovementResponse = {
  current_month_label: string;
  previous_month_label: string;
  row_ranks: RankMaster[];
  col_ranks: RankMaster[];
  cells: MovementCell[];
  row_totals: MovementTotal[];
  col_totals: MovementTotal[];
  grand_total: number;
};
