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
    customer = Customer.includes(:reservations).find(params[:id])

    rf_result = RfRankRule.call(
    reservations: customer.reservations,
    base_date: Time.current
  )

    render json: {
      id: customer.id,
      name: customer.name,
      rf_score: {
        visit_count: rf_result[:visit_count],
        last_visit_at: rf_result[:last_visit_at],
        rank: rf_result[:rank]
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