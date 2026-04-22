// 選択された日にちによって年として返す。
export function daysToYearsText(days: number) {
  if (days === 365) return "1年";
  if (days === 730) return "2年";
  if (days === 1095) return "3年";
  if (days === 1460) return "4年";
  if (days === 1825) return "5年";
  if (days === 3650) return "10年";

  return `${days}日`;
}

export function formatVisitRange(min: number, max: number | null) {
  if (max === null) return `${min}回以上`;
  if (min === max) return `${min}回`;
  return `${min}回〜${max}回`;
}

// ランク色のフォーマット
const RANK_COLOR_MAP: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-green-300",
  C: "bg-blue-300",
  D: "bg-yellow-300",
  E: "bg-orange-300",
  Z: "bg-gray-300",
  N: "bg-slate-300",
};

export function rankColor(rank: string): string {
  return RANK_COLOR_MAP[rank] ?? "bg-slate-200";
}

export function rankLabel(rank: string): string {
  switch (rank) {
    case "A":
      return "A";
    case "B":
      return "B";
    case "C":
      return "C";
    case "D":
      return "D";
    case "E":
      return "E";
    case "Z":
      return "Z";
    case "N":
      return "N";
    default:
      return rank;
  }
}

// 汎用：日付を日本語形式で表示するための関数
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ja-JP");
}

// 日付を日本語形式で表示するための関数：顧客詳細など
export function formatDate(dateString: string | null) {
  if (!dateString) {
    return "来店履歴なし";
  }

  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP");
}
