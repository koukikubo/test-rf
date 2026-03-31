class Api::V1::RfMatricesController < ApplicationController
  def index
    # RfmMatrixServiceを呼び出して、RFMマトリクスのデータを取得
    render json: RfMatrixBuilder.call, status: :ok 
  end
end