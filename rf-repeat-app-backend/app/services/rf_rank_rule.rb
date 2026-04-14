class RfRankRule
  # 集計期間: 5年
  AGGREGATION_PERIOD_DAYS = 1825

  # 判定用期間
  THREE_MONTHS_DAYS = 90
  SIX_MONTHS_DAYS   = 180
  ONE_YEAR_DAYS = 365
  TWO_YEARS_DAYS = 730

  def self.aggregation_period
    AGGREGATION_PERIOD_DAYS.days
  end

  # クラスメソッドで呼び出せるようにする
  # 例: RfRankRule.call(reservations: reservations, base_date: Time.current)
  def self.call(reservations:, base_date:)
    new.call(reservations: reservations, base_date: base_date)
  end

  # メイン処理
  def call(reservations:, base_date:)
    # 基準日は Date にそろえる
    normalized_base_date = base_date.to_date
    range_end = normalized_base_date.end_of_day

    valid_reservations = reservations.select { |reservation| reservation.visited_at.present?}
    sorted_reservations = valid_reservations.sort_by(&:visited_at)
    
    # 全期間の来店回数
    lifetime_visit_count = sorted_reservations.count
    first_visit_at = sorted_reservations.first&.visited_at
    last_visit_at = sorted_reservations.last&.visited_at

    # 来店履歴がない場合は空白（集計期間対象外）
    return build_result(
      rank: "N",
      visit_count: lifetime_visit_count,
      first_visit_at: first_visit_at,
      last_visit_at: last_visit_at,
      visits_within_3_months: 0,
      visits_within_6_months: 0,
      visits_within_1_year: 0,
      visits_within_5_years: 0,
      days_since_last: nil,
      days_since_first: nil
    ) if last_visit_at.nil?

    days_since_last = (normalized_base_date - last_visit_at.to_date).to_i
    days_since_first = (normalized_base_date - first_visit_at.to_date).to_i

    one_year_start = normalized_base_date - ONE_YEAR_DAYS.days
    six_months_start = normalized_base_date - SIX_MONTHS_DAYS.days
    three_months_start = normalized_base_date - THREE_MONTHS_DAYS.days
    five_years_start = normalized_base_date - AGGREGATION_PERIOD_DAYS.days

    # 直近1年以内の来店回数
    visits_within_1_year = reservations.count do |reservation|
      reservation.visited_at >= one_year_start && reservation.visited_at <= range_end
    end

    # 直近3ヶ月以内の来店回数
    visits_within_3_months = reservations.count do |reservation|
      reservation.visited_at >= three_months_start && reservation.visited_at <= range_end
    end

    visits_within_6_months = sorted_reservations.count do |reservation|
      reservation.visited_at >= six_months_start && reservation.visited_at <= range_end
    end

    visits_within_5_years = sorted_reservations.count do |reservation|
      reservation.visited_at >= five_years_start && reservation.visited_at <= range_end
    end


    # ランク判定
    rank = calculate_rank(
      lifetime_visit_count: lifetime_visit_count,
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months,
      visits_within_6_months: visits_within_6_months,
      visits_within_5_years: visits_within_5_years,
      days_since_first: days_since_first,
      days_since_last: days_since_last
    )

    # 呼び出し元で使いやすいようにまとめて返す
    build_result(
      rank: rank,
      visit_count: lifetime_visit_count,
      first_visit_at: first_visit_at,
      last_visit_at: last_visit_at,
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months,
      visits_within_6_months: visits_within_6_months,
      visits_within_5_years: visits_within_5_years,
      days_since_last: days_since_last,
      days_since_first: days_since_first
    )
  end

  private

  # ランク判定本体
  def calculate_rank(
    visits_within_1_year:,
    visits_within_3_months:,
    days_since_last:,
    lifetime_visit_count:,
    visits_within_6_months:,
    visits_within_5_years:,
    days_since_first:
  )

    # Z:
    # 5年で2回以下 かつ 2年以上来店なし
    return "Z" if visits_within_5_years <= 2 && days_since_last >= TWO_YEARS_DAYS

    # D:
    # 1年以上来店なし
    return "D" if days_since_last >= ONE_YEAR_DAYS

    # E:
    # 初回来店から3ヶ月以内 かつ 累計1回
    return "E" if lifetime_visit_count == 1 && days_since_first <= THREE_MONTHS_DAYS

    # A:
    # 直近3ヶ月以内に来店あり かつ 直近1年で6回以上
    return "A" if visits_within_3_months >= 1 && visits_within_1_year >= 6

    # B:
    # 直近6ヶ月以内に来店あり かつ 直近1年で3〜5回
    return "B" if visits_within_6_months >= 1 && visits_within_1_year.between?(3, 5)

    # C:
    # 直近1年以内に来店あり かつ 直近1年で1〜2回
    return "C" if days_since_last < ONE_YEAR_DAYS && visits_within_1_year.between?(1, 2)

    # 想定外ケースの保険
    "C"
  end

  # 戻り値整形
  def build_result(
      rank:,
      visit_count:,
      first_visit_at:,
      last_visit_at:, 
      visits_within_1_year:,
      visits_within_3_months:,
      visits_within_6_months:,
      visits_within_5_years:,
      days_since_last:,
      days_since_first:
    )
    {
      rank: rank,
      visit_count: visit_count,
      first_visit_at: first_visit_at,
      last_visit_at: last_visit_at,
      visits_within_1_year: visits_within_1_year,
      visits_within_3_months: visits_within_3_months,
      visits_within_6_months: visits_within_6_months,
      visits_within_5_years: visits_within_5_years,
      days_since_last: days_since_last,
      days_since_first: days_since_first
      
    }
  end
end