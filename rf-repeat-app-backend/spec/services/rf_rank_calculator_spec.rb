require "rails_helper"

RSpec.describe RfRankCalculator do
  describe ".calculate_rank" do
    it "最終来店日がない場合は E を返す" do
      rank = described_class.calculate_rank(0, nil)
      expect(rank).to eq("E")
    end
    it "1年以内かつ来店回数20回以上なら A を返す" do
      rank = described_class.calculate_rank(20, 1.year.ago + 1.day)

      expect(rank).to eq("A")
    end
    it "1年以内かつ来店回数10回以上なら B を返す" do
      rank = described_class.calculate_rank(12, 1.year.ago + 1.day)

      expect(rank).to eq("B")
    end

    it "1年以内かつ来店回数5回以上なら C を返す" do 
      rank = described_class.calculate_rank(6, 1.year.ago + 1.day)

      expect(rank).to eq("C")
    end

    it "3年以内かつ来店回数5回以上なら D を返す" do
      rank = described_class.calculate_rank(5, 3.years.ago + 1.day)

      expect(rank).to eq("D")
    end
  end
  
  describe "Eランク（その他）の判定" do
    it "期間は条件内（3年以内）だが、来店回数が不足している場合は E" do
      expect(described_class.calculate_rank(4, 2.years.ago)).to eq("E")
    end

    it "来店回数は十分（20回以上）だが、期間が3年を超えている場合は E" do
      # 3.years.ago だと計算のタイミングで 3.00001 年になる可能性があるため、
      # 確実に超えるように - 1.day をしています。
      expect(described_class.calculate_rank(20, 3.years.ago - 1.day)).to eq("E")
    end
  end
end