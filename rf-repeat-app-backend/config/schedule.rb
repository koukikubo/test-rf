# 実行環境を development にしておく
set :environment, "development"

# 毎週金曜日の 19:00 に RFスコア全体更新を実行
every :friday, at: "7:00 pm" do
  rake "rf:update_rf_scores"
end
