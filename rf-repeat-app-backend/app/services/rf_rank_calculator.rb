class RfRankCalculator
  AGGREGATION_PERIOD_DAYS = 3650
  ONE_YEAR_DAYS = 365
  THREE_YEARS_DAYS = 1095
  FIVE_YEARS_DAYS = 1825

  # 全顧客のRFスコアを更新する関数
  def self.call
    Customer.find_each do |customer|
      update_customer(customer)
    end
  end
  
  # 顧客のRFスコアを更新する関数
  def self.update_customer(customer)
    reservations = Reservation.where(customer_id: customer.id)
    visit_count = reservations.count
    last_visit_at = reservations.maximum(:visited_at)

    rank = calculate_rank(reservations, last_visit_at, visit_count)
    update_rf_score(customer, visit_count, last_visit_at, rank)
  end

  # visit_count（来店回数）, last_visit_at（最終来店日）
  def self.calculate_rank(reservations, last_visit_at ,total_visit_count)
    return "OUT" if last_visit_at.nil?
    days_since_last = (Time.current.to_date - last_visit_at.to_date).to_i
    return "OUT" if days_since_last > AGGREGATION_PERIOD_DAYS

    visits_within_1_year = reservations.where("visited_at >= ?", ONE_YEAR_DAYS.days.ago).count

    # RfMasterのランクA、B、Eの条件を取得
    a_master = RfMaster.find_by(rank: "A")
    b_master = RfMaster.find_by(rank: "B")
    e_master = RfMaster.find_by(rank: "E")

    a_min = a_master&.min_visit_count || 12
    b_min = b_master&.min_visit_count || 8
    b_max = b_master&.max_visit_count
    e_min = e_master&.min_visit_count || 1

    if visits_within_1_year >= a_min
      return "A"
    end

    if visits_within_1_year >= b_min
      return "B" if b_max.nil? || visits_within_1_year <= b_max
    end

    if visits_within_1_year == e_min && total_visit_count == 1
      return "E"
    end

    if days_since_last > 365 * 3 && days_since_last <= FIVE_YEARS_DAYS
      return "D"
    end

    if days_since_last > FIVE_YEARS_DAYS && days_since_last <= AGGREGATION_PERIOD_DAYS
      return "Z"
    end

    "C"
  end

  def self.update_rf_score(customer, visit_count, last_visit_at, rank)
    # rf_scoreが存在しない場合は新規作成、存在する場合は更新
    rf_score = customer.rf_score || customer.build_rf_score
    # rf_scoreを更新
    rf_score.update!(
      visit_count: visit_count,
      last_visit_at: last_visit_at,
      rank: rank
    )
  end
end