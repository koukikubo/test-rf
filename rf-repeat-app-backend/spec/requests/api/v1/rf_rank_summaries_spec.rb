require "rails_helper"

RSpec.describe "Api::V1::RfRankSummaries", type: :request do
  describe "GET /api/v1/rf_rank_summaries" do
    before do
      Customer.delete_all
      RfScore.delete_all

      customer_a = Customer.create!(name: "テスト太郎")
      customer_b = Customer.create!(name: "テスト次郎")

      RfScore.create!(customer: customer_a, visit_count: 5, last_visit_at: Time.current, rank: "A")
      RfScore.create!(customer: customer_b, visit_count: 3, last_visit_at: Time.current, rank: "Z")
    end

    it "顧客ランク集計結果を返す" do
      # 
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