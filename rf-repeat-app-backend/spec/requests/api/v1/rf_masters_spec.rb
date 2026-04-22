require 'rails_helper'

RSpec.describe "Api::V1::RfMasters", type: :request do
  describe "GET /api/v1/rf_masters" do
    it "RFマスタ一覧を取得できる" do
      get "/api/v1/rf_masters"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json).to be_an(Array)
      expect(json.size).to eq(7)

      ranks = json.map { |rf_master| rf_master["rank"] }
      expect(ranks).to eq(%w[A B C D E Z N])

      a_rank = json.find { |rf_master| rf_master["rank"] == "A" }
      z_rank = json.find { |rf_master| rf_master["rank"] == "Z" }

      aggregate_failures do
        expect(a_rank["min_visit_count"]).to eq(6)
        expect(a_rank["max_visit_count"]).to be_nil
        expect(a_rank["aggregation_period_days"]).to eq(1825)
        expect(a_rank["target_period_days"]).to eq(365)
        expect(a_rank["position"]).to eq(1)

        expect(z_rank["min_visit_count"]).to eq(0)
        expect(z_rank["max_visit_count"]).to eq(2)
        expect(z_rank["target_period_days"]).to eq(1825)
      end
    end
  end

end
