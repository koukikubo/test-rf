class Api::V1::RfmMatricesController < ApplicationController
  def index
    # RfmMatrixServiceを呼び出して、RFMマトリクスのデータを取得
    render json: RfmMatrixBuilder.call, status: :ok 
  end
end