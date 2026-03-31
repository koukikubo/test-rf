class RfRankRule
  # RfRankRule.call(...) で呼び出すためのエントリーポイント
  def self.call(reservations:, base_date:)
    new(reservations:, base_date:).call
  end
  # 初期化し予約データと期間をセット
  def initialize(reservations:, base_date:)
    @reservations = reservations
    @base_date = base_date.to_date
  end
  # 
  def call
    # 全期間の来店回数と、最新の来店日を取得
    total_visit_count = @reservations.count
    last_visit_at = @reservations.maximum(:visited_at)

    # ランク対象外：一度も来店がない場合は "OUT"
    return build_result("OUT", total_visit_count, last_visit_at, 0) if last_visit_at.nil?
    # 最新来店日からの経過日数
    days_since_last = (@base_date - last_visit_at.to_date).to_i
    # 最後の来店から10年（3650日）以上経過している場合は "OUT"
    return build_result("OUT", total_visit_count, last_visit_at, 0) if days_since_last > 3650
    # 直近1年間（基準日から遡って365日以内）の来店回数をカウント
    visits_within_1_year = @reservations.where("visited_at >= ? AND visited_at <= ?", @base_date - 365.days, @base_date.end_of_day).count
    # ランク判定ロジックを呼び出し
    rank = calculate_rank(
      visits_within_1_year: visits_within_1_year,
      total_visit_count: total_visit_count,
      days_since_last: days_since_last
    )
    # 判定結果をハッシュ形式で返す
    build_result(rank, total_visit_count, last_visit_at, visits_within_1_year)
  end

  private
  # ランク判定の具体的な条件
  def calculate_rank(visits_within_1_year:, total_visit_count:, days_since_last:)
    # マスタデータから基準となる来店回数を取得
    a_master = RfMaster.find_by(rank: "A")
    b_master = RfMaster.find_by(rank: "B")
    e_master = RfMaster.find_by(rank: "E")

    a_min = a_master&.min_visit_count || 12 # Aランクは、年間12回以上
    b_min = b_master&.min_visit_count || 8  # Bランクは、年間8回以上
    b_max = b_master&.max_visit_count
    e_min = e_master&.min_visit_count || 1 # Eランクは、初回のみ

    # 直近1年間の来店回数による判定 （上位ランク優先）
    return "A" if visits_within_1_year >= a_min
    return "B" if visits_within_1_year >= b_min && (b_max.nil? || visits_within_1_year <= b_max)
    return "E" if visits_within_1_year == e_min && total_visit_count == 1
    # 3年以上〜5年以内に来店がない
    return "D" if days_since_last > 365 * 3 && days_since_last <= 1825
    # 5年以上〜10年以内に来店がない
    return "Z" if days_since_last > 1825 && days_since_last <= 3650
    # 上記のいずれにも当てはまらない場合はCランク
    "C"
  end
  # レスポンスハッシュの整形
  def build_result(rank, total_visit_count, last_visit_at, visits_within_1_year)
    {
      rank: rank, # 判定されたランク
      total_visit_count: total_visit_count, # 全期間の来店数
      last_visit_at: last_visit_at, # 最終来店日
      visits_within_1_year: visits_within_1_year # 直近１年の来店数
    }
  end
end