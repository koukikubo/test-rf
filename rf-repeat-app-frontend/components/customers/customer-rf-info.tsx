import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/rf-master-format";

type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
};

type Props = {
  rfScore: RfScore | null;
};

export default function CustomerRfInfo({ rfScore }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RF情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>来店回数: {rfScore?.visit_count ?? 0}</p>
        <p>最終来店日: {formatDate(rfScore?.last_visit_at ?? null)}</p>
        <p>ランク: {rfScore?.rank ?? "未設定"}</p>
      </CardContent>
    </Card>
  );
}
