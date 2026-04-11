class Api::V1::RfRankFluctuationsController < ApplicationController
  def index
    fluctuations = RfRankMovementBuilder.call
    render json: fluctuations, status: :ok
  end
end
