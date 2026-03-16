class Api::V1::CustomersController < ApplicationController

  def index
    customers = Customer.order(:id)
    # クエリパラメータで複数のIDを指定できるようにする
    if params[:ids].present?
      ids = params[:ids].split(",").map(&:to_i)
      customers = customers.where(id: ids)
    end

    render json: customers, status: :ok
  end

  def create
    customer = Customer.new(customer_params)

    if customer.save
      render json: customer, status: :created
    else
      render json: { errors: customer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    customer = Customer.includes(:rf_score, :reservations).find(params[:id])

    render json: {
      id: customer.id,
      name: customer.name,
      rf_score: customer.rf_score && {
        visit_count: customer.rf_score.visit_count,
        last_visit_at: customer.rf_score.last_visit_at,
        rank: customer.rf_score.rank
      },
      reservations: customer.reservations.order(visited_at: :desc).map { |reservation|
        {
          id: reservation.id,
          visited_at: reservation.visited_at
        }
      }
    }, status: :ok
  end

  private
  def customer_params
    params.require(:customer).permit(:name)
  end
end