import RfTransitionCard from "@/components/rf/rf-transition";

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

async function getRfTransition(): Promise<RfTransitionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_transitions`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFMマトリクスの取得に失敗しました");
  }

  return res.json();
}

export default async function RfTransitionPage() {
  const transition = await getRfTransition();

  return (
    <main className="p-6">
      <RfTransitionCard transition={transition} />
    </main>
  );
}
