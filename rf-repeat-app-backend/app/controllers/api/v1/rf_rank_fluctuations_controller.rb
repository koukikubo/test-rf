class Api::V1::RfRankFluctuationsController < ApplicationController
  def index
    fluctuations = Rf::Builders::RankMovementBuilder.call
    render json: fluctuations, status: :ok
  end
end
