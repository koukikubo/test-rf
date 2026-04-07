class Api::V1::RfTransitionsController < ApplicationController
  def index
    render json: RfTransitionBuilder.call, status: :ok 
  end
end