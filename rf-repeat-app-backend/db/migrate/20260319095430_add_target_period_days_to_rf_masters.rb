class AddTargetPeriodDaysToRfMasters < ActiveRecord::Migration[7.2]
  def up
    add_column :rf_masters, :target_period_days, :integer

    execute <<~SQL
      UPDATE rf_masters
      SET target_period_days = CASE rank
        WHEN 'A' THEN 365
        WHEN 'B' THEN 730
        WHEN 'C' THEN 1095
        WHEN 'E' THEN 365
        WHEN 'D' THEN 1825
        ELSE 3650
      END
    SQL

    change_column_null :rf_masters, :target_period_days, false
  end

  def down
    remove_column :rf_masters, :target_period_days
  end
end