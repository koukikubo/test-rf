class RfmMatrixBuilder
    # クラスメソッドとして呼び出すためのエントリーポイント
  def self.call
    new.call
  end
  # 来店日からの経過期間の区分を定義(縦軸)
  ROWS = [
    { key: "year_1", label: "直近１年" },
    { key: "year_2", label: "１年〜２年前" },
    { key: "year_3", label: "２年〜３年前" },
    { key: "year_4", label: "３年〜４年前" },
    { key: "year_5", label: "４年〜５年前" }
  ].freeze

  def call
    # まず、分析の基準になる月を決める
    current_base_month = base_month

    # その月の表示用ラベルを作る
    analysis_month_label = current_base_month.strftime("%Y年%m月度")

    # 集計期間（10年間）の開始日と終了日を作る
    period = aggregation_period_range(current_base_month)

    # 列情報（回数帯）を作る
    cols = build_cols

    # 空のセル一覧を先に作る
    cells = build_empty_cells(cols)

    # 集計対象期間内の予約だけを取る
    reservations = Reservation.where(visited_at: period[:start]..period[:end])

    # 全顧客数（割合計算の分母）
    total_count = reservations.select(:customer_id).distinct.count

    # 顧客ごとに予約をまとめる
    reservations_by_customer = reservations.group_by(&:customer_id)

    # 顧客ごとに、
    # どの行（いつ来たか）
    # どの列（何回来たか）
    # に入るか判定する
    reservations_by_customer.each do |customer_id, customer_reservations|
      row_key = row_key_for(customer_reservations, current_base_month)
      col_key = col_key_for(customer_reservations)
      next if row_key.nil? || col_key.nil?

      cell = cells[[row_key, col_key]]
      next if cell.nil?

      cell[:count] += 1
      cell[:customer_ids] << customer_id
    end
  

    call.each do |cell|
      cell[:percentage] = 
        if total_count.zero?
          0.0
        else
          (cell[:count].to_f / total_count * 100).round(1)
        end
    end
    # 最終的に、行と列の定義、セルの情報をまとめて返す
    {
      analysis_month: analysis_month_label,
      period_start: period[:start].strftime("%Y-%m-%d"),
      period_end: period[:end].strftime("%Y-%m-%d"),
      rows: ROWS,
      cols: cols,
      cells: cells.values
    }
  end

  private
  # 分析の基準となる月を決める関数
  def base_month
    Time.current.prev_month
  end
  # 分析の基準月から、集計期間の開始日と終了日を決める関数
  def aggregation_period_range(base_month)
    period_end = base_month.end_of_month
    period_start = (base_month - 10.years + 1.month).beginning_of_month
    { start: period_start, end: period_end }
  end
  # 直近の来店日が、どの行（いつ来たか）に入るか判定する関数
  {
    start: period_start, 
    end: period_end
  }
  # 来店回数列情報を定義する関数
  def build_cols
    [
      { key: "Vip",
        label: "13回以上",
        rank_key: "A" ,
        rank_label: "A" 
      },
      { key: "high",
        label: "12~10回",
        rank_key: "B" ,
        rank_label: "B" 
      },
      { key: "middle",
        label: "9~6回",
        rank_key: "C" ,
        rank_label: "C" 
      },
      { key: "low",
        label: "5回~3回",
        rank_key: "D" ,
        rank_label: "D" 
      },
      { key: "Starter",
        label: "2回~1回",
        rank_key: "E" ,
        rank_label: "E" 
      },
    ]
  end

  # 行と列の定義をもとに、空のセルのハッシュを作る関数。表を表示する際に空白セルも表示する。
  def build_empty_cells(cols)
    ROWS.product(cols).each_with_object({}) do |(row, col), hash|
      hash[[row[:key], col[:key]]] = { 
        row_key: row[:key],
        row_label: row[:label],
        col_key: col[:key],
        col_label: col[:label],
        rank_key: col[:rank_key],
        rank_label: col[:rank_label],
        count: 0,
        percentage: 0.0,
        customer_ids: []
      }
    end
  end

  # 顧客の予約情報から、行のキーを判定する関数
  def row_key_for(customer_reservations, base_month)
    last_visit_at = customer_reservations.max_by(&:visited_at).visited_at
    return "out_of_scope" if last_visit_at.nil?

    range_1_start = (base_month - 1.year + 1.month).beginning_of_month
    range_1_end   = base_month.end_of_month

    range_2_start = (base_month - 2.years + 1.month).beginning_of_month
    range_2_end   = (base_month - 1.year).end_of_month

    range_3_start = (base_month - 3.years + 1.month).beginning_of_month
    range_3_end   = (base_month - 2.years).end_of_month

    range_4_start = (base_month - 4.years + 1.month).beginning_of_month
    range_4_end   = (base_month - 3.years).end_of_month

    range_5_start = (base_month - 5.years + 1.month).beginning_of_month
    range_5_end   = (base_month - 4.years).end_of_month

    # last_visit_atがどの期間に入るかで、行のキーを返す
    case last_visit_at
    when range_1_start..range_1_end
      "year_1"
    when range_2_start..range_2_end
      "year_2"
    when range_3_start..range_3_end
      "year_3"
    when range_4_start..range_4_end
      "year_4"
    when range_5_start..range_5_end
      "year_5"
    else
      nil
    end
  end

  # 顧客の予約情報から、列のキーを判定する関数
  def col_key_for(customer_reservations)
    visit_count = customer_reservations.size

    case visit_count
    when 13..Float::INFINITY
      "Vip"
    when 10..12
      "high"
    when 6..9
      "middle"
    when 3..5
      "low"
    when 1..2
      "Starter"
    else
      nil
    end
  end
end
    