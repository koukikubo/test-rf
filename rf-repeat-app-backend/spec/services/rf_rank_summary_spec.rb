require "rails_helper"

RSpec.describe RfRankSummary, type: :service do
  include ActiveSupport::Testing::TimeHelpers

  describe ".call" do
    around do |example|
      travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
        example.run
      end
    end

    before do
      Reservation.delete_all
      RfRankingList.delete_all
      Customer.delete_all

      customer_a = Customer.create!(name: "顧客A")
      customer_b = Customer.create!(name: "顧客B")
      customer_c = Customer.create!(name: "顧客C")

      6.times do |i|
        Reservation.create!(
          customer: customer_a,
          visited_at: Time.zone.parse("2026-01-01 12:00:00") + i.days
        )
      end

      4.times do |i|
        Reservation.create!(
          customer: customer_b,
          visited_at: Time.zone.parse("2025-11-01 12:00:00") + i.days
        )
      end

      Reservation.create!(
        customer: customer_c,
        visited_at: Time.zone.parse("2021-05-10 12:00:00")
      )
    end

    it "ランク別人数と合計値を返す" do
      result = described_class.call
      a_rank = result[:ranks].find { |rank| rank[:rank] == "A" }
      b_rank = result[:ranks].find { |rank| rank[:rank] == "B" }

      aggregate_failures do
        expect(a_rank[:count]).to eq(1)
        expect(b_rank[:count]).to eq(1)
        expect(result[:active_total]).to eq(2)
        expect(result[:rank_out_total]).to eq(1)
        expect(result[:out_of_scope_total]).to eq(0)
        expect(result[:all_customers_total]).to eq(3)
      end
    end
  end
end
