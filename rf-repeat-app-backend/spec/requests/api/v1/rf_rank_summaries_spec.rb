require "rails_helper"

RSpec.describe "Api::V1::RfRankSummaries", type: :request do
  include ActiveSupport::Testing::TimeHelpers

  describe "GET /api/v1/rf_rank_summaries" do
    around do |example|
      travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
        example.run
      end
    end

    before do
      Reservation.delete_all
      RfRankingList.delete_all
      Customer.delete_all

      customer_a = Customer.create!(name: "テスト太郎")
      customer_b = Customer.create!(name: "テスト次郎")

      6.times do |i|
        Reservation.create!(
          customer: customer_a,
          visited_at: Time.zone.parse("2026-01-01 12:00:00") + i.days
        )
      end

      Reservation.create!(
        customer: customer_b,
        visited_at: Time.zone.parse("2021-05-10 12:00:00")
      )
    end

    it "顧客ランク集計結果を返す" do
      get "/api/v1/rf_rank_summaries"
      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["ranks"]).to be_an(Array)
      expect(json["active_total"]).to eq(1)
      expect(json["rank_out_total"]).to eq(1)
      expect(json["all_customers_total"]).to eq(2)
    end
  end
end
