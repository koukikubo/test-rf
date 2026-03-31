import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RfRankSummaryTable from "@/components/rf/rf-summary-table";

type RankSummary = {
  rank: string;
  count: number;
};

type RfRankSummaryResponse = {
  ranks: RankSummary[];
  active_total: number;
  rank_out_total: number;
  out_of_scope_total: number;
  all_customers_total: number;
};

async function getRfRankSummary(): Promise<RfRankSummaryResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_rank_summaries`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("顧客ランク集計表の取得に失敗しました");
  }

  return res.json();
}

export default async function RfSummaryPage() {
  const summary = await getRfRankSummary();

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>顧客ランク集計表</CardTitle>
        </CardHeader>

        <CardContent>
          <RfRankSummaryTable summary={summary} />
        </CardContent>
      </Card>
    </main>
  );
}
