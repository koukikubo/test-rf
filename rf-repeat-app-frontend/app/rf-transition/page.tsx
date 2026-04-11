import RfTransitionCard from "@/components/rf/rf-transition";
import { buildRfKpis } from "@/lib/rf/build-rf-kpis";
import RfRankMovementBuilder from "@/components/rf/rf_rank_movement_builder";

type TransitionRow = {
  rank_key: string;
  rank_label: string;
  previous_count: number;
  current_count: number;
  diff_count: number;
  diff_rate: number | null;
  current_percentage: number;
};

type RankMaster = {
  key: string;
  label: string;
  description: string;
  order: number;
};

type RfTransitionResponse = {
  current_month_label: string;
  previous_month_label: string;
  rows: TransitionRow[];
  rank_master: RankMaster[];
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

async function getRfTransition(): Promise<RfTransitionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_transitions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RF推移表の取得に失敗しました");
  }

  return (await res.json()) as RfTransitionResponse;
}

async function getRfMovement(): Promise<RfMovementResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_rank_fluctuations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RF変動表の取得に失敗しました");
  }

  return (await res.json()) as RfMovementResponse;
}

export default async function RfTransitionPage() {
  const [transition, movement] = await Promise.all([
    getRfTransition(),
    getRfMovement(),
  ]);

  const kpis = buildRfKpis(transition);

  return (
    <main className="space-y-6 p-6">
      <RfTransitionCard
        transition={transition}
        kpis={kpis}
        rankMaster={transition.rank_master}
      />
      <RfRankMovementBuilder movement={movement} />
    </main>
  );
}
