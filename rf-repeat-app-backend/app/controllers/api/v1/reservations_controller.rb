class Api::V1::ReservationsController < ApplicationController
  def index
    reservations = Reservation.includes(:customer).order(visited_at: :desc)

    render json: reservations.map { |reservation|
      {
        id: reservation.id,
        visited_at: reservation.visited_at,
        customer: {
          id: reservation.customer.id,
          name: reservation.customer.name
        }
      }
    }, status: :ok
  end

  def create
    reservation = Reservation.new(reservation_params)

    if reservation.save
      render json: reservation, status: :created
    else
      render json: { errors: reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    reservation = Reservation.find(params[:id])
    render json: reservation, status: :ok
  end

  private
  def reservation_params
    params.require(:reservation).permit(:customer_id, :visited_at)
  end
end
