require 'rails_helper'

RSpec.describe "Api::V1::RfMasters", type: :request do
  describe "GET /api/v1/rf_masters" do
    let!(:rf_master1) { RfMaster.create!(rank: "A", min_visit_count: 10, min_days_since_last_visit: 30, position: 1) }
    let!(:rf_master2) { RfMaster.create!(rank: "B", min_visit_count: 5, min_days_since_last_visit: 15, position: 2) }

    it "RFマスタ一覧を取得できる" do
      get "/api/v1/rf_masters"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json).to be_an(Array)
      expect(json.size).to eq(2)

      ranks = json.map { |rf_master| rf_master["rank"] }
      expect(ranks).to include("A", "B")
    end
  end

end
