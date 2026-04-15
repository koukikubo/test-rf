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
      RfRankingList.delete_all
    end

    context "直近1年で1回来店している場合" do
      before do
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2026-01-10 12:00:00")
        )
      end

      it "Eランクになる" do
        described_class.update_customer(customer)

        rf_ranking_list = customer.reload.rf_ranking_list
        expect(rf_ranking_list).to be_present
        expect(rf_ranking_list.visit_count).to eq(1)
        expect(rf_ranking_list.rank).to eq("E")
        expect(rf_ranking_list.last_visit_at.to_date).to eq(Date.new(2026, 1, 10))
      end
    end

    context "直近3ヶ月以内に来店があり、直近1年で6回来店している場合" do
      before do
        6.times do |i|
          Reservation.create!(
            customer: customer,
            visited_at: Time.zone.parse("2026-01-01 12:00:00") + i.days
          )
        end
      end

      it "Aランクになる" do
        described_class.update_customer(customer)

        rf_ranking_list = customer.reload.rf_ranking_list
        expect(rf_ranking_list.visit_count).to eq(6)
        expect(rf_ranking_list.rank).to eq("A")
      end
    end

    context "最終来店が1年以上2年未満前の場合" do
      before do
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2025-01-15 12:00:00")
        )
      end

      it "Dランクになる" do
        described_class.update_customer(customer)

        rf_ranking_list = customer.reload.rf_ranking_list
        expect(rf_ranking_list.rank).to eq("D")
      end
    end
  end
end
