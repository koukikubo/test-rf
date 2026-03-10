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

puts "seed finished"