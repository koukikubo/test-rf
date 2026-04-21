class Api::V1::RfRankingListsController < ApplicationController
  def index
    base_date = Rf::Shared::BaseDate.resolve(params[:base_date])
    
    # RfRankingListモデルからデータを取得
    rows = Customer.includes(:reservations).map do |customer|
      result = Rf::Calculators::RankRule.call(
        reservations: customer.reservations,
        base_date: base_date
        ) 
        {
        id: customer.id,
        visit_count: result[:visit_count],
        last_visit_at: result[:last_visit_at],
        rank: result[:rank],
        customer: {
          id: customer.id,
          name: customer.name
        }
      }
    end

    rank_order = RfRankMaster.all
                             .sort_by { |r| r[:order] }
                             .map { |r| r[:key] }
                             .each_with_index
                             .to_h

    rows = rows.sort_by do |row|
      [
        rank_order[row[:rank]] || 999,
        -row[:visit_count].to_i
      ]
    end

    render json: rows
  end
end
