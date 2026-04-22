class RfRankMaster
  AGGREGATION_PERIOD_DAYS = 1_825
  THREE_MONTHS_DAYS = 90
  SIX_MONTHS_DAYS = 180
  ONE_YEAR_DAYS = 365
  TWO_YEARS_DAYS = 730

  RANKS = [
    { key: "A",
      label: "Aランク",
      description: "直近3ヶ月以内に来店があり、直近1年で6回以上来店している優良顧客です。",
      min_visit_count: 6,
      max_visit_count: nil,
      target_period_days: ONE_YEAR_DAYS,
      recent_visit_within_days: THREE_MONTHS_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 1
    },
    {
      key: "B",
      label: "Bランク",
      description: "直近6ヶ月以内に来店があり、直近1年で3〜5回来店している安定顧客です。",
      min_visit_count: 3,
      max_visit_count: 5,
      target_period_days: ONE_YEAR_DAYS,
      recent_visit_within_days: SIX_MONTHS_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 2
    },
    {
      key: "C",
      label: "Cランク",
      description: "直近1年以内に来店があり、直近1年で1〜2回の来店にとどまる顧客です。",
      min_visit_count: 1,
      max_visit_count: 2,
      target_period_days: ONE_YEAR_DAYS,
      recent_visit_within_days: ONE_YEAR_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 3
    },
    {
      key: "D",
      label: "Dランク",
      description: "1年以上来店がない離反予備群の顧客です。",
      min_visit_count: 1,
      max_visit_count: nil,
      target_period_days: ONE_YEAR_DAYS,
      min_days_since_last_visit: ONE_YEAR_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 4
    },
    {
      key: "E",
      label: "Eランク",
      description: "初回来店から3ヶ月以内で、まだ1回のみ来店している新規顧客です。",
      min_visit_count: 1,
      max_visit_count: 1,
      target_period_days: THREE_MONTHS_DAYS,
      first_visit_within_days: THREE_MONTHS_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 5
    },
    {
      key: "Z",
      label: "Zランク",
      description: "直近5年で2回以下かつ2年以上来店がない休眠顧客です。",
      min_visit_count: 0,
      max_visit_count: 2,
      target_period_days: AGGREGATION_PERIOD_DAYS,
      min_days_since_last_visit: TWO_YEARS_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 6
    },
    {
      key: "N",
      label: "Nランク",
      description: "来店履歴がない顧客です。",
      min_visit_count: 0,
      max_visit_count: 0,
      target_period_days: AGGREGATION_PERIOD_DAYS,
      aggregation_period_days: AGGREGATION_PERIOD_DAYS,
      order: 7
    }
  ].freeze

  def self.all
    RANKS
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

  def self.for_api
    RANKS.map.with_index(1) do |rank, index|
      {
        id: index,
        rank: rank[:key],
        min_visit_count: rank[:min_visit_count],
        max_visit_count: rank[:max_visit_count],
        aggregation_period_days: rank[:aggregation_period_days],
        target_period_days: rank[:target_period_days],
        position: rank[:order],
        key: rank[:key],
        label: rank[:label],
        description: rank[:description],
        order: rank[:order]
      }
    end
  end
end
