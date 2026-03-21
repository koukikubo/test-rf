import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  buildRfDescription,
  daysToYearsText,
  formatVisitRange,
} from "@/lib/rf-master-format";

type RfMaster = {
  id: number;
  rank: string;
  min_visit_count: number;
  max_visit_count: number | null;
  aggregation_period_days: number;
  target_period_days: number;
  position: number;
  created_at: string;
  updated_at: string;
};

async function getRfMasters(): Promise<RfMaster[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_masters`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFマスタ一覧の取得に失敗しました");
  }

  return res.json();
}

export default async function RfMastersPage() {
  const rfMasters = await getRfMasters();

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>RFマスタ管理</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {rfMasters.length === 0 ? (
            <p>RFマスタは未登録です。</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ランク</TableHead>
                    <TableHead>集計期間</TableHead>
                    <TableHead>判定対象期間</TableHead>
                    <TableHead>来店回数条件</TableHead>
                    <TableHead>条件の意味</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rfMasters.map((rfMaster) => (
                    <TableRow key={rfMaster.id}>
                      <TableCell>{rfMaster.rank}</TableCell>
                      <TableCell>
                        集計期間:
                        {daysToYearsText(rfMaster.aggregation_period_days)}
                      </TableCell>
                      <TableCell>
                        判定対象期間:
                        {daysToYearsText(rfMaster.target_period_days)}以内
                      </TableCell>
                      <TableCell>
                        来店回数:
                        {formatVisitRange(
                          rfMaster.min_visit_count,
                          rfMaster.max_visit_count,
                        )}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {buildRfDescription({
                          rank: rfMaster.rank,
                          aggregation_period_days:
                            rfMaster.aggregation_period_days,
                          target_period_days: rfMaster.target_period_days,
                          min_visit_count: rfMaster.min_visit_count,
                          max_visit_count: rfMaster.max_visit_count,
                        })}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/setting/rf-masters/${rfMaster.id}/edit`}
                          className="underline"
                        >
                          編集
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
