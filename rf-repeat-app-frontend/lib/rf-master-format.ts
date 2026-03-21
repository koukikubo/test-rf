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

export function buildRfDescription(params: {
  rank: string;
  min_visit_count: number;
  max_visit_count: number | null;
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
