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
      RfScoreUpdateJob.perform_later(reservation.customer_id)
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
    # 更新前の顧客IDを退避しておく
    # customer_id が変更された場合、変更前の顧客も再計算が必要になるため
    old_customer_id = reservation.customer_id
    if reservation.update(reservation_params)
      # もし顧客IDが変わっていたら、変更前の顧客も再計算する
      if old_customer_id != reservation.customer_id
        RfScoreUpdateJob.perform_later(old_customer_id)
      end

      # 更新後の顧客についても再計算する
      RfScoreUpdateJob.perform_later(reservation.customer_id)
    else
      render json: { errors: reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    reservation = Reservation.find(params[:id])
    # 削除後は reservation.customer_id を安全に使えない可能性があるため、
    # 先に顧客IDを退避しておく
    customer_id = reservation.customer_id

    if reservation.destroy
      RfScoreUpdateJob.perform_later(customer_id)
      render json: { message: "Reservation deleted successfully" }, status: :ok
    else
      render json: { errors: reservation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  
  def reservation_params
    params.require(:reservation).permit(:customer_id, :visited_at)
  end
end
