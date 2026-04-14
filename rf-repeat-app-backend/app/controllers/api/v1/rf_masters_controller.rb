class Api::V1::RfMastersController < ApplicationController
  def index
    rf_masters = RfMaster.order(:position)
    render json: rf_masters, status: :ok
  end
end
