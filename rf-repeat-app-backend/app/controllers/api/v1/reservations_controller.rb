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

  def update
    reservation = Reservation.find(params[:id])

    if reservation.update(reservation_params)
      render json: reservation, status: :ok
    else
      render json: { errors: reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    reservation = Reservation.find(params[:id])
    reservation.destroy
    render json: { message: "Reservation deleted successfully" }, status: :ok
  end

  private
  def reservation_params
    params.require(:reservation).permit(:customer_id, :visited_at)
  end
end
