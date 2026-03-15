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
  describe "GET /api/v1/customers" do
    let!(:customer1) { Customer.create!(name: "大阪 一太郎") }
    let!(:customer2) { Customer.create!(name: "大阪 勘太郎") }

    it "顧客一覧を取得できる" do
      get "/api/v1/customers"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json).to be_an(Array)
      names = json.map { |customer| customer["name"] }
      expect(names).to include("大阪 一太郎", "大阪 勘太郎")
    end
  end
end