class Api::V1::RfRankSummariesController < ApplicationController
  def index
    summary = RfRankSummary.call
    render json: summary, status: :ok
  end
end