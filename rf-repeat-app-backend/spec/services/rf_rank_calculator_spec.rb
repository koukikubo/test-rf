require "rails_helper"

RSpec.describe RfRankCalculator, type: :service do
  include ActiveSupport::Testing::TimeHelpers
  describe ".update_customer" do
    around do |example|
      travel_to (Time.zone.parse("2026-03-15 22:00:00")) do
        example.run
      end
    end

    let!(:customer) { Customer.create!(name: "大阪点検太朗") }

    before do
      RfMaster.delete_all

      RfMaster.create!(rank: "A", min_visit_count: 13, max_visit_count: nil, position: 1)
      RfMaster.create!(rank: "B", min_visit_count: 10, max_visit_count: 12, position: 2)
      RfMaster.create!(rank: "C", min_visit_count: nil, max_visit_count: nil, position: 3)
      RfMaster.create!(rank: "D", min_visit_count: nil, max_visit_count: nil, position: 4)
      RfMaster.create!(rank: "E", min_visit_count: 1, max_visit_count: 2, position: 5)
      RfMaster.create!(rank: "Z", min_visit_count: nil, max_visit_count: nil, position: 6)
      RfMaster.create!(rank: "OUT", min_visit_count: nil, max_visit_count: nil, position: 7)
    end

    context "直近1年で1回来店している場合" do
      before do
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2025-10-10 12:00:00")
        )
      end

      it "Eランクになる" do
        described_class.update_customer(customer)

        rf_score = customer.reload.rf_score
        expect(rf_score).to be_present
        expect(rf_score.visit_count).to eq(1)
        expect(rf_score.rank).to eq("E")
        expect(rf_score.last_visit_at.to_date).to eq(Date.new(2025, 10, 10))
      end
    end

    context "直近1年で13回来店している場合" do
      before do
        13.times do |i|
          Reservation.create!(
            customer: customer,
            visited_at: Time.zone.parse("2025-04-01 12:00:00") + i.days
          )
        end
      end

      it "Aランクになる" do
        described_class.update_customer(customer)

        rf_score = customer.reload.rf_score
        expect(rf_score.visit_count).to eq(13)
        expect(rf_score.rank).to eq("A")
      end
    end

    context "最終来店が3年以上4年未満前の場合" do
      before do
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2022-06-01 12:00:00")
        )
      end

      it "Dランクになる" do
        described_class.update_customer(customer)

        rf_score = customer.reload.rf_score
        expect(rf_score.rank).to eq("D")
      end
    end
  end
end