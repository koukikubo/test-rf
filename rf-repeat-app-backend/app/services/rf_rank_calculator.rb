class RfRankCalculator
  # 全顧客のRFスコアを更新する関数
  def self.call
    Customer.find_each do |customer|
      update_customer(customer)
    end
  end
  
  # 顧客のRFスコアを更新する関数
  def self.update_customer(customer)
    reservations = Reservation.where(customer_id: customer.id)

    # 共通ルールに判定を委譲する
    # ここで rank / 最終来店日 / 直近1年件数 などをまとめて取得する
    result = RfRankRule.call(
      reservations: reservations,
      base_date: Time.current
    )

    update_rf_score(
      customer, 
      result[:total_visit_count],
      result[:last_visit_at],
      result[:rank]
      )
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