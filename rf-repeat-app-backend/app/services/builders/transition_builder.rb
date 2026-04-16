class RfTransitionBuilder
  # クラスメソッドとして呼び出すためのエントリーポイント
  def self.call
    new.call
  end

  def call
    current_base_date = Rf::BaseDate.resolve(nil)
    previous_base_date = Rf::BaseDate.previous(current_base_date)

    # 当月と今月のラベルを作成する関数
    current_month_label = current_base_date.strftime("%Y年%m月")
    previous_month_label = previous_base_date.strftime("%Y年%m月")

    current_counts = Hash.new(0)
    previous_counts = Hash.new(0)

    # 分析の基準となる月から5年前の月の範囲内の予約をした顧客ごとに、行と列のキーを判定して、セルのハッシュを更新する関数
    Customer.includes(:reservations).find_each do |customer|
      customer_reservations = Rf::ReservationFilter.call(
        customer.reservations,
        current_base_date
      )
      previous_reservations = Rf::ReservationFilter.call(
        customer.reservations,
        previous_base_date
      )
    
      current_result = RfRankRule.call(
        reservations: customer_reservations,
        base_date: current_base_date
      )

      current_result = RfRankRule.call(
        reservations: current_reservations,
        base_date: current_base_date
      )

      previous_result = RfRankRule.call(
        reservations: previous_reservations,
        base_date: previous_base_date
      )

      current_counts[current_result[:rank]] += 1
      previous_counts[previous_result[:rank]] += 1
    end

    # セルのハッシュをもとに、行と列のキーを判定して、差分の数値と率を計算する関数
    current_total = current_counts.values.sum
    # 行と列のキーをもとに、セルのハッシュを更新する関数
    rows = RfRankMaster.all.map do |rank|
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
      rows: rows,
      rank_master: RfRankMaster.all
    }
  end
end
