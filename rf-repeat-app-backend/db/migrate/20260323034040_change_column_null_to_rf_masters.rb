class ChangeColumnNullToRfMasters < ActiveRecord::Migration[7.2]
  def change
    change_column_null :rf_masters, :min_days_since_last_visit, true
    change_column_null :rf_masters, :target_period_days, true
    change_column_null :rf_masters, :min_visit_count, true
  end
end
