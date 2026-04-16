class RfBaseDate
  # 集計期間・時間の共通ロジック
  AGGREGATION_YEARS = 5

  # パラメータから基準日を解決する
  def self.resolve(param)
    return Date.parse(param) if param.present?
    Time.current.last_month.end_of_month.to_date
  end
  # 基準月を求める関数
  def self.current_month(base_date)
    base_date.end_of_month
  end

  # 基準月の前月を求める関数
  def self.previous_month(base_date)
    (base_date - 1.month).end_of_month
  end
  # 分析の基準となる月から5年前の月の範囲を求める関数
  def self.range(base_date)
    start_date = base_date - AGGREGATION_YEARS.years
    end_date   = base_date.end_of_day
    start_date..end_date
  end
end