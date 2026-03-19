class CreateRfMasters < ActiveRecord::Migration[7.2]
  def change
    create_table :rf_masters do |t|
      t.string :rank, null: false
      t.integer :min_visit_count, null: false
      t.integer :max_visit_count
      t.integer :min_days_since_last_visit, null: false
      t.integer :max_days_since_last_visit
      t.integer :position, null: false

      t.timestamps
    end

    add_index :rf_masters, :rank, unique: true
    add_index :rf_masters, :position
  end
end
