import RfRankingTable from "@/components/rf/rf-ranking-table";

// RailsのAPIから返って来るデータの型定義
type RfRankingRow = {
  id: number;
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
  customer: {
    id: number;
    name: string;
  };
};
// RFスコアのデータをRailsのAPIから取得する関数
async function getRfRankingRows(base_date?: string): Promise<RfRankingRow[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }
  const query = base_date ? `?base_date=${encodeURIComponent(base_date)}` : "";

  const res = await fetch(`${baseUrl}/api/v1/rf_ranking_lists${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFランキングの取得に失敗しました");
  }
  return res.json();
}
// RFランキングページのUI
export default async function RfRankingPage({
  searchParams,
}: {
  searchParams?: { base_date?: string };
}) {
  const baseDate = searchParams?.base_date;
  const rfRankingRows = await getRfRankingRows(baseDate);
  return (
    <main className="p-6">
      <RfRankingTable rfRankingRows={rfRankingRows} />
    </main>
  );
}
