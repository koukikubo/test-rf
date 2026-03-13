require 'rails_helper'

RSpec.describe RfScoreUpdateJob, type: :job do
  describe "#perform" do
    let(:customer) { Customer.create!(name: "顧客A") }

    it "対象顧客を取得してRF更新処理を呼ぶ" do
      # RfRankCalculator.update_customerがcustomerを引数に呼ばれることを期待する
      expect(RfRankCalculator).to receive(:update_customer).with(customer)
      # perform_nowで今すぐ同期を実行する
      described_class.perform_now(customer.id)
    end
  end
end
