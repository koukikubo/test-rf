module Rf
  module Builders
    class RankSummary
      

      def self.call(base_date: nil)
        new.call(base_date: base_date)
      end

      def call(base_date: nil)
        base_date = Rf::Shared::BaseDate.resolve(base_date)

        grouped = Hash.new(0)

        Customer.includes(:reservations).find_each do |customer|
          result = Rf::Calculators::RankRule.call(
            reservations: customer.reservations,
            base_date: base_date
          )
          grouped[result[:rank]] += 1
        end

        {
          ranks: build_ranks(grouped),
          active_total: RfRankMaster.all.sum do |rank|
            key = rank[:key]
            next 0 if ["Z", "N"].include?(key)

            grouped[key].to_i
          end,
          rank_out_total: grouped["Z"].to_i,
          out_of_scope_total: grouped["N"].to_i,
          all_customers_total: Customer.count
        }
      end

      private

      def build_ranks(grouped)
        RfRankMaster::RANKS.map do |rank|
          key = rank[:key]
          {
            rank: key,
            count: grouped[key].to_i
          }
        end
      end
    end
  end
end

