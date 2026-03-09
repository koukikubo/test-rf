class CreateRfScores < ActiveRecord::Migration[7.2]
  def change
    create_table :rf_scores do |t|
      t.references :customer, null: false, foreign_key: true
      t.integer :visit_count, null: false, default: 0
      t.datetime :last_visit_at, null: true
      t.string :rank, null: false

      t.timestamps
    end
  end
end
