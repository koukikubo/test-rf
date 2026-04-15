require "rails_helper"

RSpec.describe "Api::V1::RfRankingLists", type: :request do
  describe "GET /api/v1/rf_ranking_lists" do
    include ActiveSupport::Testing::TimeHelpers

    around do |example|
      travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
        example.run
      end
    end

    let!(:customer) { Customer.create!(name: "顧客A") }
    let!(:first_reservation) do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2026-01-10 12:00:00")
      )
    end
    let!(:last_reservation) do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2026-02-10 12:00:00")
      )
    end

    it "最終来店日時を last_visit_at として返す" do
      get "/api/v1/rf_ranking_lists"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)
      row = json.find { |item| item["customer"]["id"] == customer.id }

      aggregate_failures do
        expect(row["visit_count"]).to eq(2)
        expect(Time.zone.parse(row["last_visit_at"])).to eq(last_reservation.visited_at)
        expect(row["customer"]["name"]).to eq("顧客A")
      end
    end
  end
end
