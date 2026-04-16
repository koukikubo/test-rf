class RfRankSummary
  
  ACTIVE_RANKS = %w[A B C D E].freeze
  DISPLAY_RANKS = %w[A B C D E].freeze

  def call(base_date: null)
    new.call(base_date: base_date)
  end

  def call(base_date: nil)
    base_date = Rf::BaseDate.resolve(base_date)

    grouped = Hash.new(0)

    Customer.includes(:reservations).find_each do |customer|
      result = RfRankRule.call(
        reservations: customer.reservations,
        base_date: base_date
      )
      grouped[result[:rank]] += 1
    end

    {
      # DISPLAY_RANKS の順番で、ランクごとの件数を配列で返す
      ranks: build_ranks(grouped),
      active_total: ACTIVE_RANKS.sum { |rank| grouped[rank].to_i },
      rank_out_total: grouped["Z"].to_i,
      out_of_scope_total: grouped["N"].to_i,
      all_customers_total: Customer.count
    }
  end

  private

  def build_ranks(grouped)
    DISPLAY_RANKS.map do |rank|
      {
        rank: rank,
        label: RfRankMaster.label_for(rank),
        count: grouped[rank].to_i
      }
    end
  end
end
