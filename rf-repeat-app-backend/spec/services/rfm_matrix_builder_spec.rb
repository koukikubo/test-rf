require "rails_helper"

RSpec.describe RfmMatrixBuilder, type: :service do
  include ActiveSupport::Testing::TimeHelpers

  describe ".call" do
    around do |example|
      # 現在時刻を固定する
      # これにより「前月基準」の計算結果が毎回同じになる
      travel_to(Time.zone.parse("2026-03-15 10:00:00")) do
        example.run
      end
    end

    # 1人の顧客だけを使って結果を追う
    let!(:customer) { Customer.create!(name: "分析表確認用顧客") }

    before do
      # 予約テーブルだけ空にする
      # Customer.delete_all までしてしまうと、
      # let!(:customer) で作った顧客が消えて外部キーエラーになる
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

      it "row_key_for と col_key_for が期待通りになる" do
        builder = described_class.new
        customer_reservations = Reservation.where(customer: customer).to_a

        expect(
          builder.send(:row_key_for, customer_reservations, builder.send(:base_month))
        ).to eq("year_1")

        expect(
          builder.send(:col_key_for, customer_reservations)
        ).to eq("starter")
      end

      it "直近1年 × 2〜1回 のセルに1件入る" do
        result = described_class.call

        target_cell = result[:cells].find do |cell|
          cell[:row_key] == "year_1" && cell[:col_key] == "starter"
        end

        expect(result[:analysis_month_label]).to eq("2026年02月度")
        expect(result[:period_start]).to eq("2016/03/01")
        expect(result[:period_end]).to eq("2026/02/28")

        expect(target_cell).to be_present
        expect(target_cell[:count]).to eq(1)
        expect(target_cell[:customer_ids]).to eq([customer.id])
        expect(target_cell[:rank_key]).to eq("E")
        expect(target_cell[:percentage]).to eq(100.0)
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

      it "row_key_for と col_key_for が期待通りになる" do
        builder = described_class.new
        customer_reservations = Reservation.where(customer: customer).to_a

        expect(
          builder.send(:row_key_for, customer_reservations, builder.send(:base_month))
        ).to eq("year_1")

        expect(
          builder.send(:col_key_for, customer_reservations)
        ).to eq("vip")
      end

      it "直近1年 × 13回以上 のセルに1件入る" do
        result = described_class.call

        target_cell = result[:cells].find do |cell|
          cell[:row_key] == "year_1" && cell[:col_key] == "vip"
        end

        expect(target_cell).to be_present
        expect(target_cell[:count]).to eq(1)
        expect(target_cell[:customer_ids]).to eq([customer.id])
        expect(target_cell[:rank_key]).to eq("A")
        expect(target_cell[:percentage]).to eq(100.0)
      end
    end

    context "最終来店が4年〜5年前で、来店回数が1回の場合" do
      before do
        Reservation.create!(
          customer: customer,
          visited_at: Time.zone.parse("2021-05-10 12:00:00")
        )
      end

      it "row_key_for と col_key_for が期待通りになる" do
        builder = described_class.new
        customer_reservations = Reservation.where(customer: customer).to_a

        expect(
          builder.send(:row_key_for, customer_reservations, builder.send(:base_month))
        ).to eq("year_5")

        expect(
          builder.send(:col_key_for, customer_reservations)
        ).to eq("starter")
      end

      it "4年〜5年前 × 2〜1回 のセルに入り、Z色の想定になる" do
        result = described_class.call

        target_cell = result[:cells].find do |cell|
          cell[:row_key] == "year_5" && cell[:col_key] == "starter"
        end

        expect(target_cell).to be_present
        expect(target_cell[:count]).to eq(1)
        expect(target_cell[:customer_ids]).to eq([customer.id])
        expect(target_cell[:rank_key]).to eq("Z")
        expect(target_cell[:percentage]).to eq(100.0)
      end
    end
  end
end