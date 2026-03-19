class Api::V1::RfMastersController < ApplicationController
  def index
    rf_masters = RfMaster.order(:position)
    render json: rf_masters, status: :ok
  end

  def show
    rf_master = RfMaster.find(params[:id])
    render json: rf_master, status: :ok
  end

  def update
    rf_master = RfMaster.find(params[:id])

    if rf_master.update(rf_master_params)
      render json: rf_master, status: :ok
    else
      render json: { errors: rf_master.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  
  def rf_master_params
    params.require(:rf_master).permit(:rank, :min_visit_count, :min_days_since_last_visit, :position)
  end
end
