import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  id: number;
  customerId: number;
  visitedAt: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

export default function ReservationBasicInfo({
  id,
  customerId,
  visitedAt,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>予約ID: {id}</p>
        <p>
          顧客ID:{" "}
          <Link href={`/customers/${customerId}`} className="underline">
            {customerId}
          </Link>
        </p>
        <p>来店日時: {formatDate(visitedAt)}</p>
      </CardContent>
    </Card>
  );
}
