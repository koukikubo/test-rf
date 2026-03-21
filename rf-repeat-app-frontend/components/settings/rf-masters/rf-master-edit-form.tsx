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
  position: string;
};

type Props = {
  rfMaster: RfMaster;
};

function rankPeriodLabel(rank: string): string {
  switch (rank) {
    case "A":
    case "B":
    case "E":
      return "直近1年以内";
    case "C":
      return "A・B・D・E・Z・対象外以外";
    case "D":
      return "3〜5年以内";
    case "Z":
      return "5年以上10年以内";
    case "OUT":
      return "集計期間対象外";
    default:
      return "未設定";
  }
}
// ランクに応じて来店回数の入力欄を有効/無効にする関数
function isCountEditable(rank: string): boolean {
  return ["A", "B", "E"].includes(rank);
}

export default function RfMasterEditForm({ rfMaster }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    rank: rfMaster.rank,
    min_visit_count: String(rfMaster.min_visit_count),
    max_visit_count:
      rfMaster.max_visit_count === null ? "" : String(rfMaster.max_visit_count),
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

  function validateForm(): string[] {
    const validationErrors: string[] = [];
    const editable = isCountEditable(formData.rank);

    const minVisit =
      formData.min_visit_count === "" ? null : Number(formData.min_visit_count);
    const maxVisit =
      formData.max_visit_count === "" ? null : Number(formData.max_visit_count);
    const position =
      formData.position === "" ? null : Number(formData.position);

    if (minVisit === null || Number.isNaN(minVisit)) {
      validationErrors.push("最小来店回数を正しく入力してください。");
    }

    if (maxVisit !== null && Number.isNaN(maxVisit)) {
      validationErrors.push("最大来店回数を正しく入力してください。");
    }

    if (minVisit !== null && minVisit < 0) {
      validationErrors.push("最小来店回数は0以上で入力してください。");
    }

    if (maxVisit !== null && maxVisit < 0) {
      validationErrors.push("最大来店回数は0以上で入力してください。");
    }

    if (minVisit !== null && maxVisit !== null && minVisit > maxVisit) {
      validationErrors.push("最小来店回数は最大来店回数以下にしてください。");
    }

    if (position === null || Number.isNaN(position)) {
      validationErrors.push("表示順を正しく入力してください。");
    }

    if (position !== null && position < 0) {
      validationErrors.push("表示順は0以上で入力してください。");
    }

    if (!editable) {
      return validationErrors;
    }

    return validationErrors;
  }

  async function handleUpdate() {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

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
        min_visit_count:
          formData.min_visit_count === ""
            ? null
            : Number(formData.min_visit_count),
        max_visit_count:
          formData.max_visit_count === ""
            ? null
            : Number(formData.max_visit_count),
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
        <p className="text-sm font-medium">集計対象期間</p>
        <div className="rounded border px-3 py-2 text-sm bg-muted">10年</div>
      </div>

      <div className="space-y-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">判定対象期間</p>
          <div className="rounded border px-3 py-2 text-sm bg-muted">
            {rankPeriodLabel(formData.rank)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="min_visit_count">来店回数（以上）</label>
        <Input
          id="min_visit_count"
          name="min_visit_count"
          type="number"
          value={formData.min_visit_count}
          onChange={handleChange}
          placeholder="例）8"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="max_visit_count">
          来店回数（以下）※未入力なら上限なし
        </label>
        <Input
          id="max_visit_count"
          name="max_visit_count"
          type="number"
          value={formData.max_visit_count}
          onChange={handleChange}
          placeholder="例）11"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="position">表示順</label>
        <Input
          id="position"
          name="position"
          type="number"
          value={formData.position}
          onChange={handleChange}
          placeholder="例）1（数値が小さいほど上位に表示される）"
        />
      </div>

      <div className="rounded border p-3 text-sm">
        {buildRfDescription({
          rank: formData.rank,
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
