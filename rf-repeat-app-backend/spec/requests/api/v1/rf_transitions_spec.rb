require "rails_helper"

RSpec.describe "Api::V1::RfTransitions", type: :request do
  include ActiveSupport::Testing::TimeHelpers

  around do |example|
    # 2026-03-15 時点に固定
    # base_month は前月なので 2026年02月 集計になる
    travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
      example.run
    end
  end

  before do
    Reservation.delete_all
    RfScore.delete_all
    Customer.delete_all
  end

  describe "GET /api/v1/rf_transitions" do
    context "顧客が存在しない場合" do
      it "200 を返し、全ランク0件の rows を返す" do
        get "/api/v1/rf_transitions"

        expect(response).to have_http_status(:ok)

        body = JSON.parse(response.body)

        aggregate_failures do
          expect(body["current_month_label"]).to eq("2026年02月")
          expect(body["previous_month_label"]).to eq("2026年01月")
          expect(body["rows"]).to be_an(Array)
          expect(body["rows"].size).to eq(7)
          expect(body["rows"].map { |row| row["rank_key"] }).to eq(%w[A B C D E Z N])

          body["rows"].each do |row|
            expect(row.keys).to contain_exactly(
              "rank_key",
              "rank_label",
              "current_count",
              "previous_count",
              "diff_count",
              "diff_rate",
              "current_percentage"
            )
          end

          expect(body["rows"].map { |row| row["current_count"] }).to all(eq(0))
          expect(body["rows"].map { |row| row["previous_count"] }).to all(eq(0))
          expect(body["rows"].map { |row| row["diff_count"] }).to all(eq(0))
          expect(body["rows"].map { |row| row["diff_rate"] }).to all(be_nil)
          expect(body["rows"].map { |row| row["current_percentage"] }).to all(eq(0.0))
        end
      end
    end

    context "複数ランクの顧客が存在する場合" do
      let!(:customer_n) { Customer.create!(name: "来店なし顧客") }
      let!(:customer_c) { Customer.create!(name: "C顧客") }
      let!(:customer_d) { Customer.create!(name: "D顧客") }
      let!(:customer_z) { Customer.create!(name: "Z顧客") }

      before do
        # C: 直近1年で2回来店
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-08-10 12:00:00")
        )
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-12-20 12:00:00")
        )

        # D: 1年以上来店なし
        Reservation.create!(
          customer: customer_d,
          visited_at: Time.zone.parse("2025-01-15 12:00:00")
        )

        # Z: 5年以内来店2回以下 かつ 2年以上来店なし
        Reservation.create!(
          customer: customer_z,
          visited_at: Time.zone.parse("2021-05-10 12:00:00")
        )
      end

      it "各ランクの件数と構成比を返す" do
        get "/api/v1/rf_transitions"

        expect(response).to have_http_status(:ok)

        body = JSON.parse(response.body)

        c_row = body["rows"].find { |row| row["rank_key"] == "C" }
        d_row = body["rows"].find { |row| row["rank_key"] == "D" }
        z_row = body["rows"].find { |row| row["rank_key"] == "Z" }
        n_row = body["rows"].find { |row| row["rank_key"] == "N" }

        aggregate_failures do
          expect(body["current_month_label"]).to eq("2026年02月")
          expect(body["previous_month_label"]).to eq("2026年01月")

          expect(c_row["current_count"]).to eq(1)
          expect(c_row["previous_count"]).to eq(1)
          expect(c_row["diff_count"]).to eq(0)
          expect(c_row["diff_rate"]).to eq(0.0)
          expect(c_row["current_percentage"]).to eq(25.0)

          expect(d_row["current_count"]).to eq(1)
          expect(d_row["previous_count"]).to eq(1)
          expect(d_row["diff_count"]).to eq(0)
          expect(d_row["diff_rate"]).to eq(0.0)
          expect(d_row["current_percentage"]).to eq(25.0)

          expect(z_row["current_count"]).to eq(1)
          expect(z_row["previous_count"]).to eq(1)
          expect(z_row["diff_count"]).to eq(0)
          expect(z_row["diff_rate"]).to eq(0.0)
          expect(z_row["current_percentage"]).to eq(25.0)

          expect(n_row["current_count"]).to eq(1)
          expect(n_row["previous_count"]).to eq(1)
          expect(n_row["diff_count"]).to eq(0)
          expect(n_row["diff_rate"]).to eq(0.0)
          expect(n_row["current_percentage"]).to eq(25.0)
        end
      end
    end

    context "前月C → 当月D に変化する顧客がいる場合" do
      let!(:customer_shift) { Customer.create!(name: "前月C→当月D顧客") }

      before do
        Reservation.create!(
          customer: customer_shift,
          visited_at: Time.zone.parse("2025-02-15 12:00:00")
        )
      end

      it "前月と当月の差分が正しく返る" do
        get "/api/v1/rf_transitions"

        expect(response).to have_http_status(:ok)

        body = JSON.parse(response.body)

        c_row = body["rows"].find { |row| row["rank_key"] == "C" }
        d_row = body["rows"].find { |row| row["rank_key"] == "D" }

        aggregate_failures do
          expect(c_row["current_count"]).to eq(0)
          expect(c_row["previous_count"]).to eq(1)
          expect(c_row["diff_count"]).to eq(-1)
          expect(c_row["diff_rate"]).to eq(-100.0)

          expect(d_row["current_count"]).to eq(1)
          expect(d_row["previous_count"]).to eq(0)
          expect(d_row["diff_count"]).to eq(1)
          expect(d_row["diff_rate"]).to be_nil
        end
      end
    end

    context "A/B/E ランクに該当する顧客がいる場合" do
      let!(:customer_a) { Customer.create!(name: "A顧客") }
      let!(:customer_b) { Customer.create!(name: "B顧客") }
      let!(:customer_e) { Customer.create!(name: "E顧客") }

      before do
        # A: 直近3ヶ月以内に来店あり かつ 直近1年で6回以上
        6.times do |i|
          Reservation.create!(
            customer: customer_a,
            visited_at: Time.zone.parse("2025-12-01 12:00:00") + i.days
          )
        end

        # B: 直近6ヶ月以内に来店あり かつ 直近1年で3〜5回
        [
          "2025-09-10 12:00:00",
          "2025-10-10 12:00:00",
          "2025-11-10 12:00:00",
          "2025-12-10 12:00:00"
        ].each do |visited_at|
          Reservation.create!(
            customer: customer_b,
            visited_at: Time.zone.parse(visited_at)
          )
        end

        # E: 初回来店から3ヶ月以内 かつ 累計1回
        Reservation.create!(
          customer: customer_e,
          visited_at: Time.zone.parse("2026-01-10 12:00:00")
        )
      end

      it "A/B/E の各ランクに1件ずつ入る" do
        get "/api/v1/rf_transitions"

        expect(response).to have_http_status(:ok)

        body = JSON.parse(response.body)

        a_row = body["rows"].find { |row| row["rank_key"] == "A" }
        b_row = body["rows"].find { |row| row["rank_key"] == "B" }
        e_row = body["rows"].find { |row| row["rank_key"] == "E" }

        aggregate_failures do
          expect(a_row["current_count"]).to eq(1)
          expect(b_row["current_count"]).to eq(1)
          expect(e_row["current_count"]).to eq(1)
        end
      end
    end
  end
end