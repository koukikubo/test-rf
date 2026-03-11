class RfRankCalculator

  def self.call
    # 顧客を1人ずつ処理
    Customer.find_each do |customer|
      reservations = Reservation.where(customer_id: customer.id)
      visit_count = reservations.count
      last_visit_at = reservations.maximum(:visited_at)
      # visit_countとlast_visit_atからランクを計算
      rank = calculate_rank(visit_count, last_visit_at)
      # 顧客のrf_scoreを更新
      update_rf_score(customer, visit_count, last_visit_at, rank)

    end
  end


  # visit_count（来店回数）, last_visit_at（最終来店日）
  def self.calculate_rank(visit_count, last_visit_at)
    # 最終来店日が存在しない場合は、ランクEとする
    return "E" if last_visit_at.nil?

    # 最後の来店から何年経ったかを計算
    years_since_last = (Time.current - last_visit_at) / 1.year
    # 1年以内に来店かつ来店回数20回以上
    if years_since_last <= 1 && visit_count >= 20
      "A"
    # 1年以内に来店かつ来店回数10回以上
    elsif years_since_last <= 1 && visit_count >= 10
      "B"
    # 1年以内に来店かつ来店回数5回以上
    elsif years_since_last <= 1 && visit_count >= 5
      "C"
    # 3年以内に来店かつ来店回数5回以上
    elsif years_since_last <= 3 && visit_count >= 5
      "D"
    else
      "E"
    end
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