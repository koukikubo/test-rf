require "rails_helper"
# 正常系-顧客作成APIのリクエストテスト
RSpec.describe "Api::V1::Customers", type: :request do
  describe "POST /api/v1/customers" do
    it "顧客を作成できる" do
      expect {
        post '/api/v1/customers', params: { customer: { name: "山田太郎" } }
      }
      .to change(Customer, :count).by(1)

      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)

      expect(json["name"]).to eq("山田太郎")
    end
    it "名前がない場合は作成できない" do
      expect {
        post '/api/v1/customers', params: { customer: { name: "" } }
      }.not_to change(Customer, :count)

      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)

      expect(json["errors"]).to include("Nameを入力してください")
    end
  end
end