class Api::V1::RfMastersController < ApplicationController
  def index
    rf_masters = RfRankMaster.for_api
    render json: rf_masters, status: :ok
  end
end
