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
    base_date = Rf::BaseDate.resolve(nil)

    # 共通ルールに判定を委譲する
    # ここで rank / 最終来店日 / 直近1年件数 などをまとめて取得する
    result = RfRankRule.call(
      reservations: reservations,
      base_date: base_date  
    )

    update_rf_score(
      customer, 
      result[:visit_count],
      result[:last_visit_at],
      result[:rank]
      )
  end

  def self.update_rf_score(customer, visit_count, last_visit_at, rank)
    rf_ranking_list = customer.rf_ranking_list || customer.build_rf_ranking_list
    rf_ranking_list.update!(
      visit_count: visit_count,
      last_visit_at: last_visit_at,
      rank: rank
    )
  end
end
