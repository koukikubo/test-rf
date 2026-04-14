class RenameRfScoresToRfRankingLists < ActiveRecord::Migration[7.2]
  def change
    rename_table :rf_scores, :rf_ranking_lists
  end
end
