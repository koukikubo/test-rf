class RfMatrixBuilder
  COLS = [
    { key: "a", label: "A条件", rank_key: "A", rank_label: "A" },
    { key: "b", label: "B条件", rank_key: "B", rank_label: "B" },
    { key: "c", label: "C条件", rank_key: "C", rank_label: "C" },
    { key: "e", label: "E条件", rank_key: "E", rank_label: "E" }
  ].freeze
  
  # 来店日からの経過期間の区分を定義(縦軸)
  ROWS = [
    { key: "year_1", label: "直近１年" },
    { key: "year_2", label: "１年〜２年" },
    { key: "year_3", label: "２年〜４年" },
    { key: "year_4", label: "４年〜５年" },
    { key: "out_of_scope", label: "対象外" }
  ].freeze

  # クラスメソッドとして呼び出すためのエントリーポイント
  def self.call
    new.call
  end

  def call
    # まず、分析の基準になる月を決める
    current_base_month = base_month
    # その月の表示用ラベルを作る
    analysis_month_label = current_base_month.strftime("%Y年%m月度")
    # 集計期間（10年間）の開始日と終了日を作る
    period = aggregation_period_range(current_base_month)

    # 列情報（回数帯）を作る
    # cols = build_cols

    # 空のセル一覧を先に作る
    cells = build_empty_cells

    # 集計対象期間内の予約だけを取る
    reservations = Reservation.where(visited_at: period[:start]..period[:end])
    # 全顧客数（割合計算の分母）
    total_count = reservations.select(:customer_id).distinct.count
    # 顧客ごとに予約をまとめる
    reservations_by_customer = reservations.group_by(&:customer_id)

    reservations_by_customer.each do |customer_id, customer_reservations|
      result = RfRankRule.call(
          reservations: Reservation.where(customer_id: customer_id),
          base_date: current_base_month.end_of_month
        )

      row_key = row_key_for(result[:last_visit_at], current_base_month.end_of_month)
      col_key = col_key_for(result[:rank])

      next if row_key.nil? || col_key.nil?

      cell = cells[[row_key, col_key]]
      next if cell.nil?

      cell[:count] += 1
      cell[:customer_ids] << customer_id
      cell[:rank_key] = result[:rank]
      cell[:rank_label] = result[:rank]
    end
  

    cells.each_value do |cell|
      cell[:percentage] = 
        if total_count.zero?
          0.0
        else
          (cell[:count].to_f / total_count * 100).round(1)
        end
    end
    # 最終的に、行と列の定義、セルの情報をまとめて返す
    {
      analysis_month_label: analysis_month_label,
      period_start: period[:start].strftime("%Y/%m/%d"),
      period_end: period[:end].strftime("%Y/%m/%d"),
      rows: ROWS,
      cols: COLS,
      cells: cells.values
    }
  end

  private
  # 分析の基準となる月を決める関数
  def base_month
    Time.current.prev_month
  end
  # 集計期間５年に設定
  def aggregation_period_range(base_month)
    period_end = base_month.end_of_month
    period_start = (base_month - 5.years + 1.month).beginning_of_month
    { start: period_start, end: period_end }
  end

  # 行と列の定義をもとに、空のセルのハッシュを作る関数。表を表示する際に空白セルも表示する。
  def build_empty_cells
    ROWS.product(COLS).each_with_object({}) do |(row, col), hash|
      hash[[row[:key], col[:key]]] = { 
        row_key: row[:key],
        row_label: row[:label],
        col_key: col[:key],
        col_label: col[:label],
        rank_key: col[:rank_key],
        rank_label: col[:rank_key],
        count: 0,
        percentage: 0.0,
        customer_ids: []
      }
    end
  end

  # 顧客の予約情報から、行のキーを判定する関数
  def row_key_for(last_visit_at, base_date)
    return "out_of_scope" if last_visit_at.nil?

    days_since_last = (base_date.to_date - last_visit_at.to_date).to_i

    case days_since_last
    when 0...365
      "year_1"
    when 365...730
      "year_2"
    when 730...1460
      "year_3"
    when 1460...1825
      "year_4"
    else
      "out_of_scope"
    end
  end

    # 列はアクティブ中心非アクティブはCに寄せておく後で非アクティブを考える。
  def col_key_for(rank)
    case rank
    when "A"
      "a"
    when "B"
      "b"
    when "E"
      "e"
    when "C", "D", "F", ""
      "c"
    else
      nil
    end
  end
end