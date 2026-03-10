class CreateReservations < ActiveRecord::Migration[7.2]
  def change
    create_table :reservations do |t|
      t.references :customer, null: false, foreign_key: true
      t.datetime :visited_at, null: false
      t.timestamps
    end
  end
end
