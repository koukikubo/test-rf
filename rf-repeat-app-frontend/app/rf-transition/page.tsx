import RfTransitionCard from "@/components/rf/rf-transition";
import { buildRfKpis } from "@/lib/rf/build-rf-kpis";
import RfRankMovementBuilder from "@/components/rf/movement_builder/rf_rank_movement_builder";
import { RankMaster, RfMovementResponse } from "@/types/rf/movement_builder";

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
  rank_master: RankMaster[];
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
