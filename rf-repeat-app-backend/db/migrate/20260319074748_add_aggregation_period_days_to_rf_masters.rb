class AddAggregationPeriodDaysToRfMasters < ActiveRecord::Migration[7.2]
  def change
    add_column :rf_masters, :aggregation_period_days, :integer, null: false, default: 3650
  end
end
