"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { buildRfDescription } from "@/lib/rf-master-format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

type RfMaster = {
  id: number;
  rank: string;
  min_visit_count: number;
  max_visit_count: number | null;
  aggregation_period_days: number;
  target_period_days: number;
  position: number;
};

type FormData = {
  rank: string;
  min_visit_count: string;
  max_visit_count: string;
  aggregation_period_days: string;
  target_period_days: string;
  position: string;
};

type Props = {
  rfMaster: RfMaster;
};

export default function RfMasterEditForm({ rfMaster }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    rank: rfMaster.rank,
    min_visit_count: String(rfMaster.min_visit_count),
    max_visit_count:
      rfMaster.max_visit_count === null ? "" : String(rfMaster.max_visit_count),
    aggregation_period_days: String(rfMaster.aggregation_period_days),
    target_period_days: String(rfMaster.target_period_days),
    position: String(rfMaster.position),
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleUpdate() {
    setErrors([]);
    setIsSubmitting(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!baseUrl) {
      setErrors(["NEXT_PUBLIC_API_BASE_URL が設定されていません"]);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      rf_master: {
        rank: formData.rank,
        min_visit_count: Number(formData.min_visit_count),
        max_visit_count:
          formData.max_visit_count === ""
            ? null
            : Number(formData.max_visit_count),
        aggregation_period_days: Number(formData.aggregation_period_days),
        target_period_days: Number(formData.target_period_days),
        position: Number(formData.position),
      },
    };

    try {
      const res = await fetch(`${baseUrl}/api/v1/rf_masters/${rfMaster.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrors(data?.errors ?? ["RFマスタの更新に失敗しました"]);
        setIsSubmitting(false);
        return;
      }

      router.push("/setting/rf-masters");
      router.refresh();
    } catch {
      setErrors(["通信エラーが発生しました"]);
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded border bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="rank">ランク</label>
        <Input
          id="rank"
          name="rank"
          value={formData.rank}
          onChange={handleChange}
          placeholder="A"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="aggregation_period_days">集計期間（日数）</label>
        <Input
          id="aggregation_period_days"
          name="aggregation_period_days"
          value={formData.aggregation_period_days}
          onChange={handleChange}
          placeholder="大前提としてデフォルトでは集計期間を10年としています。"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="target_period_days">判定対象期間（日数）</label>
        <Input
          id="target_period_days"
          name="target_period_days"
          value={formData.target_period_days}
          onChange={handleChange}
          placeholder="例）直近1年以内の顧客をランクAとする場合は365を入力"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="min_visit_count">最小来店回数</label>
        <Input
          id="min_visit_count"
          name="min_visit_count"
          value={formData.min_visit_count}
          onChange={handleChange}
          placeholder="例）5"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="max_visit_count">
          最大来店回数（未入力の場合は上限なし）
        </label>
        <Input
          id="max_visit_count"
          name="max_visit_count"
          value={formData.max_visit_count}
          onChange={handleChange}
          placeholder="例）10"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="position">表示順</label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="例）1（数値が小さいほど上位に表示される）"
        />
      </div>

      <div className="rounded border p-3 text-sm">
        {buildRfDescription({
          rank: formData.rank,
          aggregation_period_days: Number(
            formData.aggregation_period_days || 3650,
          ),
          target_period_days: Number(formData.target_period_days || 365),
          min_visit_count: Number(formData.min_visit_count || 0),
          max_visit_count:
            formData.max_visit_count === ""
              ? null
              : Number(formData.max_visit_count),
        })}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" disabled={isSubmitting}>
            {isSubmitting ? "更新中..." : "更新する"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>この内容で更新しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              更新すると、RFマスタの判定条件が変更されます。
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded border p-3 text-sm">
            {buildRfDescription({
              rank: formData.rank,
              aggregation_period_days: Number(
                formData.aggregation_period_days || 3650,
              ),
              target_period_days: Number(formData.target_period_days || 365),
              min_visit_count: Number(formData.min_visit_count || 0),
              max_visit_count:
                formData.max_visit_count === ""
                  ? null
                  : Number(formData.max_visit_count),
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              更新する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
