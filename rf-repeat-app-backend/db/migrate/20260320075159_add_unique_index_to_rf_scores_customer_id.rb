class AddUniqueIndexToRfScoresCustomerId < ActiveRecord::Migration[7.2]
  def change
    remove_index :rf_scores, :customer_id if index_exists?(:rf_scores, :customer_id)
    add_index :rf_scores, :customer_id, unique: true  
  end
end
