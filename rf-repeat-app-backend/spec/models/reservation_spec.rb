require "rails_helper"

RSpec.describe Reservation, type: :model do
  describe "after_commit callback" do
    let(:customer) { Customer.create!(name: "顧客A") }

    before do
      ActiveJob::Base.queue_adapter = :test
      clear_enqueued_jobs
    end
    it "予約作成後にRF更新Jobをenqueueする" do
        # RfScoreUpdateJobがperform_laterで呼ばれることを期待する
        expect {
          Reservation.create!(customer: customer, visited_at: Time.current)
      }.to have_enqueued_job(RfScoreUpdateJob).with(customer.id)
    end
  end
end