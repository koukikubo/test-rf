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
import { rankLabel, rowLabel } from "@/lib/rf-master-format";

type Customer = {
  id: number;
  name: string;
};
// RFM分析の対象顧客を取得するためのAPI呼び出し関数
async function getCustomersByIds(ids: string): Promise<Customer[]> {
  // APIのベースURLは環境変数から取得
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // ベースURLが設定されていない場合はエラーをスロー
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }
  // APIエンドポイントに対してfetchリクエストを送信
  const res = await fetch(`${baseUrl}/api/v1/customers?ids=${ids}`, {
    cache: "no-store",
  });
  // レスポンスが正常でない場合はエラーをスロー
  if (!res.ok) {
    throw new Error("対象顧客一覧の取得に失敗しました");
  }

  return res.json();
}

// 顧客IDのリストをクエリパラメータで受け取るため、searchParamsを使用している
export default async function RfmTargetCustomersPage({
  searchParams,
}: {
  // クエリパラメータからidsを受け取るための型定義
  searchParams: Promise<{ ids?: string; row?: string; col?: string }>;
}) {
  // クエリパラメータからids、row、colを取得
  const { ids = "", row = "", col = "" } = await searchParams;
  // idsが存在する場合はgetCustomersByIds関数を呼び出して顧客情報を取得、存在しない場合は空の配列を使用
  const customers = ids ? await getCustomersByIds(ids) : [];

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>対象顧客一覧</CardTitle>
          <p className="text-sm text-muted-foreground">
            来店期間: {rowLabel(row)} / ランク: {rankLabel(col)}
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
                        <Link href={`/customers/${customer.id}`}>
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
