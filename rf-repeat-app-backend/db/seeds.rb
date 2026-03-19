# ---------------------
# customersのダミーデータを作成
# ---------------------

customers = []

20.times do |i|
  customers << Customer.create!(
    name: "顧客#{i + 1}"
  )
end

puts "customers created"

# ---------------------
# reservationsのダミーデータを作成
# ---------------------

20.times do
  Reservation.create!(
    customer: customers.sample,
    visited_at: rand(1..180).days.ago
  )
end

puts "reservations created"

# ---------------------
# rf_mastersの初期データを作成
# ---------------------

RfMaster.find_or_create_by!(rank: "A") do |rf_master|
  rf_master.min_visit_count = 12
  rf_master.max_visit_count = nil
  rf_master.min_days_since_last_visit = 0
  rf_master.max_days_since_last_visit = 365
  rf_master.target_period_days = 365
  rf_master.aggregation_period_days = 3650
  rf_master.position = 1
end

RfMaster.find_or_create_by!(rank: "B") do |rf_master|
  rf_master.min_visit_count = 6
  rf_master.max_visit_count = 11
  rf_master.min_days_since_last_visit = 0
  rf_master.max_days_since_last_visit = 730
  rf_master.target_period_days = 730
  rf_master.aggregation_period_days = 3650
  rf_master.position = 2
end

RfMaster.find_or_create_by!(rank: "C") do |rf_master|
  rf_master.min_visit_count = 2
  rf_master.max_visit_count = 5
  rf_master.min_days_since_last_visit = 0
  rf_master.max_days_since_last_visit = 1095
  rf_master.target_period_days = 1095
  rf_master.aggregation_period_days = 3650
  rf_master.position = 3
end

RfMaster.find_or_create_by!(rank: "E") do |rf_master|
  rf_master.min_visit_count = 1
  rf_master.max_visit_count = 1
  rf_master.min_days_since_last_visit = 0
  rf_master.max_days_since_last_visit = 365
  rf_master.aggregation_period_days = 3650
  rf_master.position = 4
end

RfMaster.find_or_create_by!(rank: "D") do |rf_master|
  rf_master.min_visit_count = 1
  rf_master.max_visit_count = nil
  rf_master.min_days_since_last_visit = 366
  rf_master.max_days_since_last_visit = 1825
  rf_master.aggregation_period_days = 3650
  rf_master.position = 5
end

puts "rf_masters created"
puts "seed finished"