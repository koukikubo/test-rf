import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RfMasterEditForm from "@/components/settings/rf-masters/rf-master-edit-form";

type RfMaster = {
  id: number;
  rank: string;
  min_visit_count: number;
  max_visit_count: number | null;
  aggregation_period_days: number;
  target_period_days: number;
  position: number;
};

async function getRfMaster(id: string): Promise<RfMaster> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL が設定されていません");
  }

  const res = await fetch(`${baseUrl}/api/v1/rf_masters/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("RFマスタの取得に失敗しました");
  }

  return res.json();
}

export default async function EditRfMasterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfMaster = await getRfMaster(id);

  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>RFマスタ編集</CardTitle>

            <Link href="/setting/rf-masters" className="underline">
              RFマスタ一覧へ戻る
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <RfMasterEditForm rfMaster={rfMaster} />
        </CardContent>
      </Card>
    </main>
  );
}
