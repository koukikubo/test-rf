class RfReservationFilter
  # 予約の中から、訪問日時がbase_dateを基準とした期間内にあるものを抽出する
  def self.call(reservations, base_date)
    # RfBaseDate.range(base_date)で、base_dateを基準とした期間の範囲オブジェクトを取得する
    range = RfBaseDate.range(base_date)

    # 
    reservations.select do |r|
      r.visited_at.present? &&
      range.cover?(r.visited_at)
    end
  end
end