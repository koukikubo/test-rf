class RfmMatrixBuilder
  # 来店日からの経過期間の区分を定義(縦軸)
  ROWS = [
    { key: "recent", label: "1年以内" },
    { key: "middle", label: "1年以上3年以内" },
    { key: "old", label: "3年以上5年以内" },
    { key: "inactive", label: "5年以上10年以内" },
    { key: "out_of_scope", label: "対象外" }
  ].freeze

  # 来店回数の区分を定義(横軸)
  COLS = [
    { key: "A", label: "A" },
    { key: "B", label: "B" },
    { key: "C", label: "C" },
    { key: "D", label: "D" },
    { key: "E", label: "E" },
    { key: "Z", label: "Z" },
    { key: "OUT", label: "G(集計期間対象外顧客)" }
  ].freeze

  # クラスメソッドとして呼び出すためのエントリーポイント
  def self.call
    new.call
  end

  def call
    # RfScoreテーブルから全てのレコードを取得し、来店日と来店回数に基づいて行と列のキーを決定
    scores = RfScore.includes(:customer)
    # 行と列のキーを組み合わせたセルを初期化
    cells = build_empty_cells
    # RfScoreのレコードを一つずつ処理して、対応するセルのカウントを増やす
    scores.find_each do |score|
      row_key = row_key_for(score.last_visit_at)
      col_key = col_key_for(score.rank)
      # 行と列のキーが有効な場合にのみセルのカウントを増やす
      next unless row_key && col_key
      # セルのカウントを増やし、顧客IDを追加
      cells[[row_key, col_key]][:count] += 1  
      cells[[row_key, col_key]][:customer_ids] << score.customer_id
    end 
    # 行と列の定義とセルのデータを組み合わせて、RFMマトリックスの構造を返す
    {
      rows: ROWS,
      cols: COLS,
      cells: cells.values
    }
  end

  private
  # 行と列の定義に基づいて、全てのセルを初期化する関数
  def build_empty_cells
    ROWS.product(COLS).each_with_object({}) do |(row, col), hash|
      hash[[row[:key], col[:key]]] = { 
        row_key: row[:key],
        row_label: row[:label],
        col_key: col[:key],
        col_label: col[:label],
        count: 0,
        customer_ids: []
      }
    end
  end
  # 来店日からの経過期間の区分を決定する関数
  def row_key_for(last_visit_at)
    return "out_of_scope" if last_visit_at.nil?
    # 来店日からの経過日数を計算
    days = (Time.current.to_date - last_visit_at.to_date).to_i
    # 経過日数に基づいて行のキーを決定
    if days <= 365
      "recent"
    elsif days <= 1095
      "middle"
    elsif days <= 1825
      "old"
    elsif days <= 3650
      "inactive"
    else
      "out_of_scope"
    end
  end
  # 来店回数の区分を決定する関数
  def col_key_for(rank)
    return nil if rank.blank?
    # RfMasterのrankに基づいて列のキーを決定
    COLS.any? { |col| col[:key] == rank } ? rank : nil
  end
end
    