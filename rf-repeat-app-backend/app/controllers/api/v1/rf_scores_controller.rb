class Api::V1::RfScoresController < ApplicationController
  def index
    # ランク昇順、来店回数降順に設定
    rf_scores = RfScore.includes(:customer).order(rank: :asc, visit_count: :desc)

    render json: rf_scores.as_json(
      only: [:visit_count, :last_visit_at, :rank],
      include: {
        customer: {
          only: [:id, :name]
        }
      }
    )
  end
end