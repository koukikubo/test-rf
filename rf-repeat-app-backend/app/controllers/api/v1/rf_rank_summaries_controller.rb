class Api::V1::RfRankSummariesController < ApplicationController
  def index
    summary = Rf::Builders::RankSummary.call
    render json: summary, status: :ok
  end
end