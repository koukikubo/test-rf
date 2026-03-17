import RfRankingTable from "@/components/rf/rf-ranking-table";

// RailsのAPIから返って来るデータの型定義
type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
  customer: {
    id: number;
    name: string;
  };
};
// RFスコアのデータをRailsのAPIから取得する関数
async function getRfScores(): Promise<RfScore[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_scores/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFランキングの取得に失敗しました");
  }
  return res.json();
}
// RFランキングページのUI
export default async function RfRankingPage() {
  const rfScores = await getRfScores();
  return (
    <main className="p-6">
      <RfRankingTable rfScores={rfScores} />
    </main>
  );
}
