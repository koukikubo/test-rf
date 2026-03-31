import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/rf-master-format";

type Props = {
  createdAt: string;
  updatedAt: string;
};

export default function ReservationMetaInfo({ createdAt, updatedAt }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>記録情報</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>作成日時: {formatDateTime(createdAt)}</p>
        <p>更新日時: {formatDateTime(updatedAt)}</p>
      </CardContent>
    </Card>
  );
}
