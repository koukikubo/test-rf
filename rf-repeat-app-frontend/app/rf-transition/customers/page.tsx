import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { rankLabel } from "@/lib/rf-master-format";

type Customer = {
  id: number;
  name: string;
};
type FluctuationCell = {
  from_rank_key: string;
  from_rank_label: string;
  to_rank_key: string;
  to_rank_label: string;
  count: number;
  customer_ids: number[];
};
type RankFluctuationResponse = {
  current_month_label: string;
  previous_month_label: string;
  cells: FluctuationCell[];
};

function modeLabel(mode: string): string {
  switch (mode) {
    case "previous":
      return "先月人数";
    case "current":
      return "今月人数";
    case "changed":
      return "変動人数";
    default:
      return "未設定";
  }
}

async function getFluctuations(): Promise<RankFluctuationResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_rank_fluctuations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("対象顧客の取得に失敗しました");
  }

  return (await res.json()) as RankFluctuationResponse;
}

async function getCustomersByIds(ids: number[]): Promise<Customer[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  if (ids.length === 0) {
    return [];
  }

  const res = await fetch(
    `${baseUrl}/api/v1/customers?ids=${encodeURIComponent(ids.join(","))}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("対象顧客の取得に失敗しました");
  }

  return (await res.json()) as Customer[];
}

function extractCustomerIds(
  data: RankFluctuationResponse,
  mode: string,
  rank: string,
): number[] {
  const matchedCells = data.cells.filter((cell) => {
    switch (mode) {
      case "previous":
        return cell.from_rank_key === rank;
      case "current":
        return cell.to_rank_key === rank;
      case "changed":
        return (
          cell.to_rank_key === rank && cell.from_rank_key !== cell.to_rank_key
        );
      default:
        return false;
    }
  });

  return [...new Set(matchedCells.flatMap((cell) => cell.customer_ids) ?? [])];
}

// 顧客IDのリストをクエリパラメータで受け取るため、searchParamsを使用している
export default async function RfmTargetCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; month?: string; rank?: string }>;
}) {
  const { mode = "", month = "", rank = "" } = await searchParams;

  const fluctuation = await getFluctuations();
  const ids = extractCustomerIds(fluctuation, mode, rank);
  const customers: Customer[] = await getCustomersByIds(ids);

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>対象顧客一覧</CardTitle>
          <p className="text-sm text-muted-foreground">
            区分: {modeLabel(mode)} / 月: {month || "未設定"} / ランク:{" "}
            {rankLabel(rank)}
          </p>
        </CardHeader>

        <CardContent>
          {customers.length === 0 ? (
            <p>対象顧客はいません</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>顧客名</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>
                        <Link
                          href={`/customers/${customer.id}`}
                          className="hover:underline"
                        >
                          {customer.name}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
