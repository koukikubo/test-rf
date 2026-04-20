import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/rf-master-format";

type RfRankingList = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
};

type Props = {
  rf_ranking_list: RfRankingList | null;
};

export default function CustomerRfInfo({ rf_ranking_list }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RF情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>来店回数: {rf_ranking_list?.visit_count ?? 0}</p>
        <p>最終来店日: {formatDate(rf_ranking_list?.last_visit_at ?? null)}</p>
        <p>ランク: {rf_ranking_list?.rank ?? "未設定"}</p>
      </CardContent>
    </Card>
  );
}
