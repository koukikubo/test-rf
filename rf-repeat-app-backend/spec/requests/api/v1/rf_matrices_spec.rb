require "rails_helper"

RSpec.describe "Api::V1::RfMatrices", type: :request do
  include ActiveSupport::Testing::TimeHelpers

  around do |example|
    # 現在時刻を固定する
    # これにより「前月基準」の分析月度が毎回同じになる
    travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
      example.run
    end
  end

  let!(:customer) { Customer.create!(name: "API確認用顧客") }

  before do
    Reservation.delete_all
    RfScore.delete_all
  end

  context "直近1年で2回来店している顧客がいる場合" do
    before do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2025-08-10 12:00:00")
      )
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2025-12-20 12:00:00")
      )
    end

    it "RF分析表のJSONを返す" do
      get "/api/v1/rf_matrices"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      # 表全体の基本情報
      expect(body["analysis_month_label"]).to eq("2026年02月度")
      expect(body["period_start"]).to eq("2016/03/01")
      expect(body["period_end"]).to eq("2026/02/28")

      # rows / cols / cells が配列で返ること
      expect(body["rows"]).to be_an(Array)
      expect(body["cols"]).to be_an(Array)
      expect(body["cells"]).to be_an(Array)

      # 直近1年 × 2〜1回 のセルを探す
      target_cell = body["cells"].find do |cell|
        cell["row_key"] == "year_1" && cell["col_key"] == "starter"
      end

      expect(target_cell).to be_present
      expect(target_cell["count"]).to eq(1)
      expect(target_cell["rank_key"]).to eq("E")
      expect(target_cell["percentage"]).to eq(100.0)
      expect(target_cell["customer_ids"]).to eq([customer.id])
    end
  end

  context "直近1年で13回来店している顧客がいる場合" do
    before do
      13.times do |i|
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2025-04-01 12:00:00") + i.days
        )
      end
    end

    it "直近1年 × 13回以上 のセルが返る" do
      get "/api/v1/rf_matrices"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      target_cell = body["cells"].find do |cell|
        cell["row_key"] == "year_1" && cell["col_key"] == "vip"
      end

      expect(target_cell).to be_present
      expect(target_cell["count"]).to eq(1)
      expect(target_cell["rank_key"]).to eq("A")
      expect(target_cell["percentage"]).to eq(100.0)
      expect(target_cell["customer_ids"]).to eq([customer.id])
    end
  end

  context "最終来店が4年〜5年前で、来店回数が1回の場合" do
    before do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2021-05-10 12:00:00")
      )
    end

    it "4年〜5年前 × 2〜1回 のセルが返る" do
      get "/api/v1/_matrices"

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)

      target_cell = body["cells"].find do |cell|
        cell["row_key"] == "year_5" && cell["col_key"] == "starter"
      end

      expect(target_cell).to be_present
      expect(target_cell["count"]).to eq(1)
      expect(target_cell["rank_key"]).to eq("Z")
      expect(target_cell["percentage"]).to eq(100.0)
      expect(target_cell["customer_ids"]).to eq([customer.id])
    end
  end
end