class RfRankRule
  # 集計期間: 5年
  AGGREGATION_PERIOD_DAYS = 1825

  # 判定用期間
  ONE_YEAR_DAYS = 365
  THREE_MONTHS_DAYS = 90
  TWO_YEARS_DAYS = 730
  FOUR_YEARS_DAYS = 1460

  # クラスメソッドで呼び出せるようにする
  # 例: RfRankRule.call(reservations: reservations, base_date: Time.current)
  def self.call(reservations:, base_date:)
    new.call(reservations: reservations, base_date: base_date)
  end

  # メイン処理
  def call(reservations:, base_date:)
    # 基準日は Date にそろえる
    normalized_base_date = base_date.to_date

    # 全期間の来店回数
    total_visit_count = reservations.count

    # 最終来店日
    last_visit_at = reservations.max_by(&:visited_at)&.visited_at

    # 来店履歴がない場合は空白（対象外）
    return build_result(
      rank: "",
      total_visit_count: total_visit_count,
      last_visit_at: last_visit_at,
      visits_within_1_year: 0,
      visits_within_3_months: 0
    ) if last_visit_at.nil?

    # 最終来店日から基準日までの経過日数
    days_since_last = (normalized_base_date - last_visit_at.to_date).to_i

    # 5年以上来店がない場合は空白（対象外）
    return build_result(
      rank: "",
      total_visit_count: total_visit_count,
      last_visit_at: last_visit_at,
      visits_within_1_year: 0,
      visits_within_3_months: 0
    ) if days_since_last >= AGGREGATION_PERIOD_DAYS

    # 直近1年・直近3ヶ月の集計範囲
    one_year_start = normalized_base_date - ONE_YEAR_DAYS.days
    three_months_start = normalized_base_date - THREE_MONTHS_DAYS.days
    range_end = normalized_base_date.end_of_day

    # 直近1年以内の来店回数
    visits_within_1_year = reservations.count do |reservation|
      reservation.visited_at >= one_year_start && reservation.visited_at <= range_end
    end

    # 直近3ヶ月以内の来店回数
    visits_within_3_months = reservations.count do |reservation|
      reservation.visited_at >= three_months_start && reservation.visited_at <= range_end
    end

    # ランク判定
    rank = calculate_rank(
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months,
      days_since_last: days_since_last
    )

    # 呼び出し元で使いやすいようにまとめて返す
    build_result(
      rank: rank,
      total_visit_count: total_visit_count,
      last_visit_at: last_visit_at,
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months
    )
  end

  private

  # ランク判定本体
  def calculate_rank(visits_within_1_year:, visits_within_3_months:, days_since_last:)
    # A:
    # 直近1年で13回以上来店
    return "A" if visits_within_1_year >= 13

    # B:
    # 直近3ヶ月以内に来店あり
    # かつ 直近1年で8回以上12回以下
    if visits_within_3_months >= 1 &&
        visits_within_1_year >= 8 &&
        visits_within_1_year <= 12
        return "B"
    end

    # E:
    # 直近1年以内に来店が1回だけ
    return "E" if visits_within_1_year == 1

    # D:
    # 2年以上〜4年未満来店がない
    return "D" if days_since_last >= TWO_YEARS_DAYS &&
                  days_since_last < FOUR_YEARS_DAYS

    # Z:
    # 4年以上〜5年未満来店がない
    return "Z" if days_since_last >= FOUR_YEARS_DAYS &&
                  days_since_last < AGGREGATION_PERIOD_DAYS

    # C:
    # 上記いずれにも当てはまらない顧客
    "C"
  end

  # 戻り値整形
  def build_result(rank:, total_visit_count:, last_visit_at:, visits_within_1_year:, visits_within_3_months:)
    {
      rank: rank,
      total_visit_count: total_visit_count,
      last_visit_at: last_visit_at,
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months
    }
  end
end