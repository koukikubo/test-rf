class Reservation < ApplicationRecord
  belongs_to :customer
  # 予約が作成された後にRFスコア更新ジョブをキューに追加するためのコールバック
  after_commit :enqueue_rf_score_update, on: :create

  private
  # 予約が作成された後にRFスコア更新ジョブをキューに追加する
  def enqueue_rf_score_update
    RfScoreUpdateJob.perform_later(customer_id)
  end
end
