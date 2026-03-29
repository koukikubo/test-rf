require "rails_helper"

RSpec.describe RfRankSummary, type: :service do
  describe ".call" do
    before do
      Customer.delete_all
      RfScore.delete_all

      customer_a = Customer.create!(name: "顧客A")
      customer_b = Customer.create!(name: "顧客B")
      customer_c = Customer.create!(name: "顧客C")

      RfScore.create!(customer: customer_a, visit_count: 5, last_visit_at: Time.current, rank: "A")
      RfScore.create!(customer: customer_b, visit_count: 3, last_visit_at: Time.current, rank: "B")
      RfScore.create!(customer: customer_c, visit_count: 1, last_visit_at: Time.current, rank: "Z")
    end

    it "ランク別人数と合計値を返す" do
      # 集計サービスを実行する
      result = described_class.call
      # ランク別配列にA,B,Zが含まれていることを確認する。
      expect(result[:ranks]).to include({ rank: "A", count: 1 })
      expect(result[:ranks]).to include({ rank: "B", count: 1 })
      expect(result[:ranks]).to include({ rank: "Z", count: 1 })

      # A〜Eランクの合計数、今回はZを除いて2名
      expect(result[:active_total]).to eq(2)
      # ランク外は1名
      expect(result[:rank_out_total]).to eq(1)
      # 集計期間対象外は0名
      expect(result[:out_of_scope_total]).to eq(0)
      # RFランクがついている顧客集計、今回は3名作成しているため。
      expect(result[:all_customers_total]).to eq(3)
    end
  end
end