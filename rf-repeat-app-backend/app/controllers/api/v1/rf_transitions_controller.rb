class Api::V1::RfTransitionsController < ApplicationController
  def index
    render json: Rf::Builders::TransitionBuilder.call, status: :ok 
  end
end