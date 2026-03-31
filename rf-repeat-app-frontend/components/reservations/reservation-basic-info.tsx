import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/rf-master-format";

type Props = {
  id: number;
  customerId: number;
  visitedAt: string;
};

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
        <p>来店日時: {formatDateTime(visitedAt)}</p>
      </CardContent>
    </Card>
  );
}
