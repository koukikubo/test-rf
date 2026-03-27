require 'rails_helper'

RSpec.describe "Api::V1::Reservations", type: :request do
  describe "POST /api/v1/reservations" do
    let(:customer) { Customer.create!(name: "顧客A") }

    it "予約を作成できる" do
      expect {
        post '/api/v1/reservations', params: { reservation: { customer_id: customer.id, visited_at: Time.current } }
      }.to change(Reservation, :count).by(1)

      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)

      expect(json["customer_id"]).to eq(customer.id)
    end

    it "customer_idがない場合は作成できない" do
      expect {
        post '/api/v1/reservations', params: { reservation: { customer_id: nil, visited_at: Time.current } }
      }.not_to change(Reservation, :count)

      expect(response).to have_http_status(:unprocessable_content)

      json = JSON.parse(response.body)

      expect(json["errors"]).not_to be_empty
    end

    it "visited_atがない場合は作成できない" do
      expect {
        post '/api/v1/reservations', params: { reservation: { customer_id: customer.id, visited_at: nil } }
      }.not_to change(Reservation, :count)

      expect(response).to have_http_status(:unprocessable_content)

      json = JSON.parse(response.body)

      expect(json["errors"]).not_to be_empty
    end
  end

  describe "GET /api/v1/reservations" do
    let!(:customer) { Customer.create!(name: "大阪 一太郎") }
    let!(:reservation1) { Reservation.create!(customer: customer, visited_at: 1.day.ago) }
    let!(:reservation2) { Reservation.create!(customer: customer, visited_at: Time.current) }

    it "予約一覧を取得できる" do
      get "/api/v1/reservations"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json).to be_an(Array)
      expect(json.size).to be >= 2
    end
  end

  describe "GET /api/v1/reservations/:id" do
    let!(:customer) { Customer.create!(name: "大阪 一太郎") }
    let!(:reservation) { Reservation.create!(customer: customer, visited_at: Time.current) }

    it "予約詳細を取得できる" do
      get "/api/v1/reservations/#{reservation.id}"

      expect(response).to have_http_status(:ok)

      json = JSON.parse(response.body)

      expect(json["id"]).to eq(reservation.id)
      expect(json["customer_id"]).to eq(customer.id)
    end
  end
end

# RfScoreUpdateJob の enqueue をテストするためのコード
RSpec.describe "Api::V1::Reservations", type: :request do
  include ActiveJob::TestHelper

  let!(:customer) { Customer.create!(name: "予約確認顧客") }

  before do
    clear_enqueued_jobs
    clear_performed_jobs
  end

  describe "POST /api/v1/reservations" do
    it "予約作成成功時に RfScoreUpdateJob を enqueue する" do
      expect do
        post "/api/v1/reservations", params: {
          reservation: {
            customer_id: customer.id,
            visited_at: "2026-03-25T12:00:00"
          }
        }
      end.to have_enqueued_job(RfScoreUpdateJob).with(customer.id)

      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH /api/v1/reservations/:id" do
    let!(:reservation) do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2026-03-20 12:00:00")
      )
    end

    it "予約更新成功時に RfScoreUpdateJob を enqueue する" do
      expect do
        patch "/api/v1/reservations/#{reservation.id}", params: {
          reservation: {
            visited_at: "2026-03-26T12:00:00"
          }
        }
      end.to have_enqueued_job(RfScoreUpdateJob).with(customer.id)

      expect(response).to have_http_status(:ok)
    end
  end

  describe "DELETE /api/v1/reservations/:id" do
    let!(:reservation) do
      Reservation.create!(
        customer: customer,
        visited_at: Time.zone.parse("2026-03-20 12:00:00")
      )
    end

    it "予約削除成功時に RfScoreUpdateJob を enqueue する" do
      expect do
        delete "/api/v1/reservations/#{reservation.id}"
      end.to have_enqueued_job(RfScoreUpdateJob).with(customer.id)

      expect(response).to have_http_status(:ok)
    end
  end
end