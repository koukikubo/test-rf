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

  describe "GET /api/v1/rf_masters/:id" do
    let!(:rf_master) { RfMaster.create!(rank: "A", min_visit_count: 10, min_days_since_last_visit: 30, position: 1) }

    it "RFマスターを1件を取得できる" do
      get "/api/v1/rf_masters/#{rf_master.id}"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["id"]).to eq(rf_master.id)
      expect(json["rank"]).to eq("A")
      expect(json["position"]).to eq(1)
    end
  end

  describe "POST /api/v1/rf_masters" do
    let(:valid_params) do
      {
        rf_master: {
          rank: "A",
          min_visit_count: 20,
          max_visit_count: nil,
          min_days_since_last_visit: 0,
          max_days_since_last_visit: 365,
          position: 1
        }
      }
    end

    let(:invalid_params) do
      {
        rf_master: {
          rank: "",
          min_visit_count: nil,
          max_visit_count: nil,
          min_days_since_last_visit: nil,
          max_days_since_last_visit: nil,
          position: nil
        }
      }
    end

    it "RFマスターを作成できる" do
      expect {
        post "/api/v1/rf_masters", params: valid_params
      }.to change(RfMaster, :count).by(1)

      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)

      expect(json["rank"]).to eq("A")
      expect(json["min_visit_count"]).to eq(20)
      expect(json["position"]).to eq(1)
    end

    it "必須項目が不足していると作成できない" do
      expect {
        post "/api/v1/rf_masters", params: invalid_params
      }.not_to change(RfMaster, :count)

      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)

      expect(json["errors"]).not_to be_empty
    end
  end

  describe "PATCH /api/v1/rf_masters/:id" do
    let!(:rf_master) do
      RfMaster.create!(
        rank: "A",
        min_visit_count: 20,
        min_days_since_last_visit: 0,
        max_visit_count: nil,
        max_days_since_last_visit: 365,
        position: 1
      )
    end
    it "RFマスターを更新できる" do
      patch "/api/v1/rf_masters/#{rf_master.id}", params: {
        rf_master: {
          min_visit_count: 25,
          position: 10
        }
      }

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["min_visit_count"]).to eq(25)
      expect(json["position"]).to eq(10)
    end

    it "不正な値では更新できない" do
      patch "/api/v1/rf_masters/#{rf_master.id}", params: {
        rf_master: {
          rank: "",
          position: nil
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)

      expect(json["errors"]).not_to be_empty  

      rf_master.reload
      expect(rf_master.rank).to eq("A")
      expect(rf_master.position).to eq(1)
    end
  end

  describe "DELETE /api/v1/rf_masters/:id" do
    let!(:rf_master) do
      RfMaster.create!(
        rank: "A",
        min_visit_count: 20,
        min_days_since_last_visit: 0,
        max_visit_count: nil,
        max_days_since_last_visit: 365,
        position: 1
      )
    end

    it "RFマスターを削除できる" do
      expect {
        delete "/api/v1/rf_masters/#{rf_master.id}"
      }.to change(RfMaster, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end
  end
end
