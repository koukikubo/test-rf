import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RfScore = {
  visit_count: number;
  last_visit_at: string | null;
  rank: string;
};

type Props = {
  rfScore: RfScore | null;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "未設定";

  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

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
