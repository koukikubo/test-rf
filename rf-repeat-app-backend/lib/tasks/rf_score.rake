namespace :rf do
  desc "RFスコアを計算して更新するタスク"
  task update_rf_scores: :environment do
    Rf::Calculators::RankCalculator.call
    puts "RFスコアの更新が完了しました。"
  end
end