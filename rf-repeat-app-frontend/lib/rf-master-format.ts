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

export function formatTargetPeriod(days: number) {
  return `直近${daysToYearsText(days)}以内`;
}

// RFマスタの説明文のフォーマット
export function buildRfDescription(params: {
  rank: string;
  min_visit_count: number;
  max_visit_count: number | null;
  aggregation_period_days: number;
  target_period_days: number;
}) {
  const { rank, min_visit_count, max_visit_count } = params;

  if (rank === "A") {
    return `直近10年の来店履歴を対象に、直近1年以内に${min_visit_count}回以上来店している顧客をランクA（超常連顧客）として判定します。`;
  }

  if (rank === "B") {
    if (max_visit_count === null) {
      return `直近10年の来店履歴を対象に、直近1年以内に${min_visit_count}回以上来店している顧客をランクB（常連客）として判定します。`;
    }

    return `直近10年の来店履歴を対象に、直近1年以内に${min_visit_count}回以上${max_visit_count}回以下来店している顧客をランクB（常連客）として判定します。`;
  }

  if (rank === "C") {
    return "直近10年の来店履歴を対象に、A・B・D・E・Z・対象外のいずれにも該当しない顧客をランクCとして判定します。";
  }

  if (rank === "D") {
    return "過去に来店実績があり、直近3年以上5年以内に来店がない顧客をランクD（休眠客）として判定します。";
  }

  if (rank === "E") {
    return "直近10年の来店履歴を対象に、直近1年以内に1回来店し、かつ累計来店回数が1回の顧客をランクE（新規顧客）として判定します。";
  }

  if (rank === "Z") {
    return "過去に来店実績があるものの、直近5年以上10年以内に来店がない顧客をランクZ（ランク外）として判定します。";
  }

  if (rank === "OUT") {
    return "集計期間10年の対象外顧客です。";
  }
  return "条件未設定です。";
}

// ランク色のフォーマット
export const RANK_COLOR_MAP: Record<string, string> = {
  A: "bg-green-600",
  B: "bg-green-300",
  C: "bg-blue-300",
  D: "bg-yellow-300",
  E: "bg-orange-300",
  Z: "bg-gray-300",
  OUT: "bg-slate-300",
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
      return "ランク外";
    case "OUT":
      return "集計期間対象外";
    default:
      return rank;
  }
}

export function rankMeaning(rank: string): string {
  switch (rank) {
    case "A":
      return "直近１年以内に13回以上来店がある顧客です。";
    case "B":
      return "直近１年かつ３ヶ月以内に来店があり8回以上の来店がある顧客です。";
    case "C":
      return "他のランクに当てはまらない客層群です。";
    case "D":
      return "２年〜４年来店がない顧客です。";
    case "E":
      return "新規顧客：直近1年以内に初回来店顧客です。";
    case "Z":
      return "ランク外：集計期間内に履歴はあるものの、優先ランク条件には当てはまらない顧客です。";
    case "OUT":
      return "対象外：集計期間の対象外となる顧客です。";
    default:
      return "";
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

export function rowLabel(row: string): string {
  switch (row) {
    case "recent":
      return "1年以内";
    case "middle":
      return "1年以上3年以内";
    case "old":
      return "3年以上5年以内";
    case "inactive":
      return "5年以上10年以内";
    case "out_of_scope":
      return "対象外";
    default:
      return "未設定";
  }
}
