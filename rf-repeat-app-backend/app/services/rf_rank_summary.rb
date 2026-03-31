class RfRankSummary
  
  ACTIVE_RANKS = %w[A B C D E].freeze
  DISPLAY_RANKS = %w[A B C D E Z OUT].freeze

  def self.call
    new.call
  end

  def call
    # rankごとに rf_scores を集計した Hashを返す
    grouped = RfScore.group(:rank).count

    {
      # DISPLAY_RANKS の順番で、ランクごとの件数を配列で返す
      ranks: build_ranks(grouped),
      active_total: ACTIVE_RANKS.sum { |rank| grouped[rank].to_i },
      rank_out_total: grouped["Z"].to_i,
      out_of_scope_total: grouped["OUT"].to_i,
      all_customers_total: Customer.count
    }
  end

  private

  def build_ranks(grouped)
    # 来店回数がない場合は、nilではなく０を返す。
    DISPLAY_RANKS.map do |rank|
      {
        rank: rank,
        count: grouped[rank].to_i
      }
    end
  end
end