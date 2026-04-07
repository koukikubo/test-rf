class RfTransitionBuilder
  RANKS = [
    { key: "A", label: "Aランク" },
    { key: "B", label: "Bランク" },
    { key: "C", label: "Cランク" },
    { key: "D", label: "Dランク" },
    { key: "E", label: "Eランク" },
    { key: "Z", label: "Zランク" },
    { key: "", label: "対象外" }
  ].freeze

  # クラスメソッドとして呼び出すためのエントリーポイント
  def self.call
    new.call
  end

  def call
    # 分析の基準となる月を決める関数
    current_base_month = base_month
    # 分析の基準となる月の末日を求める関数
    current_base_date = current_base_month.end_of_month
    # 分析基準付きの前日末日を求める関数
    previous_base_date = (current_base_month - 1.month).end_of_month

    # 当月と今月のラベルを作成する関数
    current_month_label = current_base_month.strftime("%Y年%m月")
    previous_month_label = (current_base_month - 1.month).strftime("%Y年%m月")

    # 分析の基準となる月から5年前の月の範囲を求める関数
    period = aggregation_period_range(current_base_month)

    # 分析の基準となる月から5年前の月の範囲内の予約を取得する関数
    reservations = Reservation.where(visited_at: period[:start]..period[:end])

    current_counts = Hash.new(0)
    previous_counts = Hash.new(0)
    reservations_by_customer = reservations.to_a.group_by(&:customer_id)

    # 分析の基準となる月から5年前の月の範囲内の予約をした顧客ごとに、行と列のキーを判定して、セルのハッシュを更新する関数
    reservations_by_customer.each do |customer_id, customer_reservations|
      # 分析の基準となる月の末日を基準にして、行と列のキーを判定する関数
      current_result = RfRankRule.call(
        reservations: customer_reservations,
        base_date: current_base_date
      )
      # 前回の分析の基準となる月の末日を基準にして、行と列のキーを判定する関数
      previous_result = RfRankRule.call(
        reservations: customer_reservations,
        base_date: previous_base_date
      )
      # 行と列のキーをもとに、セルのハッシュを更新する関数
      current_counts[current_result[:rank]] += 1
      previous_counts[previous_result[:rank]] += 1
    end

    # セルのハッシュをもとに、行と列のキーを判定して、差分の数値と率を計算する関数
    current_total = current_counts.values.sum
    # 行と列のキーをもとに、セルのハッシュを更新する関数
    rows = RANKS.map do |rank|
      current_count = current_counts[rank[:key]]
      previous_count = previous_counts[rank[:key]]
      diff_count = current_count - previous_count

      # 前回の数値が0の場合は、差分率はnilとする。そうでない場合は、差分の数値を前回の数値で割って100をかけて、小数点第一位までの数値とする。
      diff_rate = 
        if previous_count.zero? 
          nil
        else
          (diff_count.to_f / previous_count * 100).round(1)
        end

      current_percentage = 
        if current_total.zero?
          0.0
        else
          (current_count.to_f / current_total * 100).round(1)
        end

      # 行と列のキーをもとに、セルのハッシュを更新する関数
      {
        rank_key: rank[:key],
        rank_label: rank[:label],
        current_count: current_count,
        previous_count: previous_count,
        diff_count: diff_count,
        diff_rate: diff_rate,
        current_percentage: current_percentage
      }
    end
    # 分析の基準となる月と同じ月のラベルと、1年前の同じ月のラベルと、行と列のキーをもとに、セルのハッシュを更新する関数
    {
      current_month_label: current_month_label,
      previous_month_label: previous_month_label,
      rows: rows
    }
  end

  private
  # 分析基準月：前月
  def base_month
    Time.current.prev_month
  end
  # 集計期間５年に設定
  def aggregation_period_range(base_month)
    period_end = base_month.end_of_month
    period_start = (base_month - 5.years + 1.month).beginning_of_month
    { start: period_start, end: period_end }
  end
end