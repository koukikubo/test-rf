require 'rails_helper'

RSpec.describe RfMaster, type: :model do
  it "RFマスタを作成できる" do
    rf_master = described_class.create!(
      rank: "A",
      min_visit_count: 6,
      position: 1
    )

    expect(rf_master).to be_persisted
  end
end
