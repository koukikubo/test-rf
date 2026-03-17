import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default function ReservationMetaInfo({
  createdAt,
  updatedAt,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>記録情報</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>作成日時: {formatDate(createdAt)}</p>
        <p>更新日時: {formatDate(updatedAt)}</p>
      </CardContent>
    </Card>
  );
}