class RfRankMaster
  RANKS = [
    { key: "A",
      label: "Aランク",
      description: "直近3ヶ月以内に来店があり、直近1年で6回以上来店している優良顧客です。",
      order: 1
    },
    {
      key: "B",
      label: "Bランク",
      description: "直近6ヶ月以内に来店があり、直近1年で3〜5回来店している安定顧客です。",
      order: 2
    },
    {
      key: "C",
      label: "Cランク",
      description: "直近1年以内に来店があり、直近1年で1〜2回の来店にとどまる顧客です。",
      order: 3
    },
    {
      key: "D",
      label: "Dランク",
      description: "1年以上来店がない離反予備群の顧客です。",
      order: 4
    },
    {
      key: "E",
      label: "Eランク",
      description: "初回来店から3ヶ月以内で、まだ1回のみ来店している新規顧客です。",
      order: 5
    },
    {
      key: "Z",
      label: "Zランク",
      description: "直近5年で2回以下かつ2年以上来店がない休眠顧客です。",
      order: 6
    },
    {
      key: "N",
      label: "Nランク",
      description: "来店履歴がない顧客です。",
      order: 7
    }
  ].freeze

  def self.keys
    RANKS.map { |rank| rank[:key] }
  end

  def self.all
    RANKS
  end

  def self.label_for(key)
    RANKS.find { |rank| rank[:key] == key }&.dig(:label)
  end

  def self.description_for(key)
    RANKS.find { |rank| rank[:key] == key }&.dig(:description)
  end

  def self.active_keys
    %w[A B C D E]
  end

  def self.rank_out_key
    "Z"
  end

  def self.out_of_scope_key
    "N"
  end
end