class Reservation < ApplicationRecord
  belongs_to :customer

  validates :customer, :visited_at, presence: true

  before_destroy :store_customer_id_for_rf_update
  after_commit :enqueue_rf_score_update_job, on: %i[create update destroy]

  private

  def store_customer_id_for_rf_update
    @customer_id_for_rf_update = customer_id
  end

  def enqueue_rf_score_update_job
    target_customer_id = @customer_id_for_rf_update || customer_id
    RfScoreUpdateJob.perform_later(target_customer_id) if target_customer_id.present?
  end
end
