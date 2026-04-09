require "rails_helper"

RSpec.describe RfTransitionBuilder, type: :service do
  include ActiveSupport::Testing::TimeHelpers

  describe ".call" do
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

    context "返却構造の確認" do
      let!(:customer_n) { Customer.create!(name: "来店なし顧客") }

      it "current_month_label / previous_month_label / rows を返す" do
        result = described_class.call

        expect(result[:current_month_label]).to eq("2026年02月")
        expect(result[:previous_month_label]).to eq("2026年01月")
        expect(result[:rows]).to be_an(Array)
      end

      it "rows に A/B/C/D/E/Z/N が順番どおり含まれる" do
        result = described_class.call

        expect(result[:rows].map { |row| row[:rank_key] }).to eq(%w[A B C D E Z N])
      end

      it "各 row が必要なキーを持つ" do
        result = described_class.call

        result[:rows].each do |row|
          expect(row.keys).to contain_exactly(
            :rank_key,
            :rank_label,
            :current_count,
            :previous_count,
            :diff_count,
            :diff_rate,
            :current_percentage
          )
        end
      end
    end

    context "Nランク: 来店履歴がない顧客がいる場合" do
      let!(:customer_n) { Customer.create!(name: "来店なし顧客") }

      it "Nランクに1件入る" do
        result = described_class.call
        n_row = result[:rows].find { |row| row[:rank_key] == "N" }

        expect(n_row).to be_present
        expect(n_row[:current_count]).to eq(1)
        expect(n_row[:previous_count]).to eq(1)
        expect(n_row[:diff_count]).to eq(0)
        expect(n_row[:diff_rate]).to eq(0.0)
        expect(n_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Zランク: 5年以内来店2回以下かつ2年以上来店がない顧客がいる場合" do
      let!(:customer_z) { Customer.create!(name: "Z顧客") }

      before do
        Reservation.create!(
          customer: customer_z,
          visited_at: Time.zone.parse("2021-05-10 12:00:00")
        )
      end

      it "Zランクに1件入る" do
        result = described_class.call
        z_row = result[:rows].find { |row| row[:rank_key] == "Z" }

        expect(z_row).to be_present
        expect(z_row[:current_count]).to eq(1)
        expect(z_row[:previous_count]).to eq(1)
        expect(z_row[:diff_count]).to eq(0)
        expect(z_row[:diff_rate]).to eq(0.0)
        expect(z_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Dランク: 1年以上来店がない顧客がいる場合" do
      let!(:customer_d) { Customer.create!(name: "D顧客") }

      before do
        Reservation.create!(
          customer: customer_d,
          visited_at: Time.zone.parse("2025-01-15 12:00:00")
        )
      end

      it "Dランクに1件入る" do
        result = described_class.call
        d_row = result[:rows].find { |row| row[:rank_key] == "D" }

        expect(d_row).to be_present
        expect(d_row[:current_count]).to eq(1)
        expect(d_row[:previous_count]).to eq(1)
        expect(d_row[:diff_count]).to eq(0)
        expect(d_row[:diff_rate]).to eq(0.0)
        expect(d_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Eランク: 初回来店から3ヶ月以内かつ累計1回の顧客がいる場合" do
      let!(:customer_e) { Customer.create!(name: "E顧客") }

      before do
        Reservation.create!(
          customer: customer_e,
          visited_at: Time.zone.parse("2026-01-10 12:00:00")
        )
      end

      it "Eランクに1件入る" do
        result = described_class.call
        e_row = result[:rows].find { |row| row[:rank_key] == "E" }

        expect(e_row).to be_present
        expect(e_row[:current_count]).to eq(1)
        expect(e_row[:previous_count]).to eq(1)
        expect(e_row[:diff_count]).to eq(0)
        expect(e_row[:diff_rate]).to eq(0.0)
        expect(e_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Aランク: 直近3ヶ月以内に来店あり かつ 直近1年で6回以上の顧客がいる場合" do
      let!(:customer_a) { Customer.create!(name: "A顧客") }

      before do
        6.times do |i|
          Reservation.create!(
            customer: customer_a,
            visited_at: Time.zone.parse("2025-12-01 12:00:00") + i.days
          )
        end
      end

      it "Aランクに1件入る" do
        result = described_class.call
        a_row = result[:rows].find { |row| row[:rank_key] == "A" }

        expect(a_row).to be_present
        expect(a_row[:current_count]).to eq(1)
        expect(a_row[:previous_count]).to eq(1)
        expect(a_row[:diff_count]).to eq(0)
        expect(a_row[:diff_rate]).to eq(0.0)
        expect(a_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Bランク: 直近6ヶ月以内に来店あり かつ 直近1年で3〜5回の顧客がいる場合" do
      let!(:customer_b) { Customer.create!(name: "B顧客") }

      before do
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
      end

      it "Bランクに1件入る" do
        result = described_class.call
        b_row = result[:rows].find { |row| row[:rank_key] == "B" }

        expect(b_row).to be_present
        expect(b_row[:current_count]).to eq(1)
        expect(b_row[:previous_count]).to eq(1)
        expect(b_row[:diff_count]).to eq(0)
        expect(b_row[:diff_rate]).to eq(0.0)
        expect(b_row[:current_percentage]).to eq(100.0)
      end
    end

    context "Cランク: 直近1年以内に来店あり かつ 直近1年で1〜2回の顧客がいる場合" do
      let!(:customer_c) { Customer.create!(name: "C顧客") }

      before do
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-08-10 12:00:00")
        )
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-12-20 12:00:00")
        )
      end

      it "Cランクに1件入る" do
        result = described_class.call
        c_row = result[:rows].find { |row| row[:rank_key] == "C" }

        expect(c_row).to be_present
        expect(c_row[:current_count]).to eq(1)
        expect(c_row[:previous_count]).to eq(1)
        expect(c_row[:diff_count]).to eq(0)
        expect(c_row[:diff_rate]).to eq(0.0)
        expect(c_row[:current_percentage]).to eq(100.0)
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

      it "前月はC、当月はDとして集計される" do
        result = described_class.call

        c_row = result[:rows].find { |row| row[:rank_key] == "C" }
        d_row = result[:rows].find { |row| row[:rank_key] == "D" }

        aggregate_failures do
          expect(c_row[:current_count]).to eq(0)
          expect(c_row[:previous_count]).to eq(1)
          expect(c_row[:diff_count]).to eq(-1)
          expect(c_row[:diff_rate]).to eq(-100.0)

          expect(d_row[:current_count]).to eq(1)
          expect(d_row[:previous_count]).to eq(0)
          expect(d_row[:diff_count]).to eq(1)
          expect(d_row[:diff_rate]).to be_nil
        end
      end
    end

    context "顧客が4人いて、構成比が 25.0% ずつになる場合" do
      let!(:customer_n) { Customer.create!(name: "来店なし顧客") }
      let!(:customer_c) { Customer.create!(name: "C顧客") }
      let!(:customer_d) { Customer.create!(name: "D顧客") }
      let!(:customer_z) { Customer.create!(name: "Z顧客") }

      before do
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-08-10 12:00:00")
        )
        Reservation.create!(
          customer: customer_c,
          visited_at: Time.zone.parse("2025-12-20 12:00:00")
        )

        Reservation.create!(
          customer: customer_d,
          visited_at: Time.zone.parse("2025-01-15 12:00:00")
        )

        Reservation.create!(
          customer: customer_z,
          visited_at: Time.zone.parse("2021-05-10 12:00:00")
        )
      end

      it "current_percentage が正しく計算される" do
        result = described_class.call

        c_row = result[:rows].find { |row| row[:rank_key] == "C" }
        d_row = result[:rows].find { |row| row[:rank_key] == "D" }
        z_row = result[:rows].find { |row| row[:rank_key] == "Z" }
        n_row = result[:rows].find { |row| row[:rank_key] == "N" }

        aggregate_failures do
          expect(c_row[:current_percentage]).to eq(25.0)
          expect(d_row[:current_percentage]).to eq(25.0)
          expect(z_row[:current_percentage]).to eq(25.0)
          expect(n_row[:current_percentage]).to eq(25.0)
        end
      end
    end

    context "顧客が存在しない場合" do
      it "全ランクの current_count / previous_count / diff_count / diff_rate / current_percentage が0またはnilになる" do
        result = described_class.call

        aggregate_failures do
          expect(result[:rows].map { |row| row[:current_count] }).to all(eq(0))
          expect(result[:rows].map { |row| row[:previous_count] }).to all(eq(0))
          expect(result[:rows].map { |row| row[:diff_count] }).to all(eq(0))
          expect(result[:rows].map { |row| row[:diff_rate] }).to all(be_nil)
          expect(result[:rows].map { |row| row[:current_percentage] }).to all(eq(0.0))
        end
      end
    end
  end
end