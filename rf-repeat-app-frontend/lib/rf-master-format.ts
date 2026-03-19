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
  aggregation_period_days: number;
  target_period_days: number;
  min_visit_count: number;
  max_visit_count: number | null;
}) {
  const {
    rank,
    aggregation_period_days,
    target_period_days,
    min_visit_count,
    max_visit_count,
  } = params;

  const aggregationText = `集計期間${daysToYearsText(aggregation_period_days)}`;
  const targetText = `直近${daysToYearsText(target_period_days)}以内`;
  const visitText = formatVisitRange(min_visit_count, max_visit_count);

  return `${aggregationText}間内の来店履歴を対象に、${targetText}に${visitText}来店している顧客をランク${rank || "未設定"}として判定します。`;
}
