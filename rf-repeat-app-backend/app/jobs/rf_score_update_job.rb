class RfScoreUpdateJob < ApplicationJob
  # デフォルトのキューで実行される。
  queue_as :default
  
  # 予約された時間に実行されるジョブスイッチ
  def perform(customer_id)
    customer = Customer.find(customer_id)
    RfRankCalculator.update_customer(customer)
  end
end
