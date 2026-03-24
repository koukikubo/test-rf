# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_03_23_034040) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "customers", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reservations", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.datetime "visited_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_reservations_on_customer_id"
  end

  create_table "rf_masters", force: :cascade do |t|
    t.string "rank", null: false
    t.integer "min_visit_count"
    t.integer "max_visit_count"
    t.integer "min_days_since_last_visit"
    t.integer "max_days_since_last_visit"
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "aggregation_period_days", default: 3650, null: false
    t.integer "target_period_days"
    t.index ["position"], name: "index_rf_masters_on_position"
    t.index ["rank"], name: "index_rf_masters_on_rank", unique: true
  end

  create_table "rf_scores", force: :cascade do |t|
    t.bigint "customer_id", null: false
    t.integer "visit_count", default: 0, null: false
    t.datetime "last_visit_at"
    t.string "rank", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_rf_scores_on_customer_id", unique: true
  end

  add_foreign_key "reservations", "customers"
  add_foreign_key "rf_scores", "customers"
end
