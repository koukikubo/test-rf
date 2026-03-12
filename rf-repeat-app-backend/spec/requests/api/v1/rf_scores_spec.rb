require "rails_helper"

RSpec.describe "Api::V1::RfScores", type: :request do
    describe "GET /api/v1/rf_scores" do
      let!(:customer) { Customer.create!(name: "顧客A") }
      let!(:rf_score) do
            RfScore.create!(
              customer: customer,
              visit_count: 12,
              last_visit_at: Time.current,
              rank: "B"
            )
      end
      it "ステータス200でRFスコア一覧を返す" do
        get "/api/v1/rf_scores"

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)

        expect(json).to be_an(Array)
        expect(json.first["visit_count"]).to eq(12)
        expect(json.first["rank"]).to eq("B")
        expect(json.first["customer"]["name"]).to eq("顧客A")          
      end
    end
end
