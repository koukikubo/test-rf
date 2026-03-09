# テーブル設計

## Customers テーブル

| Column     | Type     | Options     |
| ---------- | -------- | ----------- |
| name       | string   | null: false |
| created_at | datetime | null: false |
| updated_at | datetime | null: false |

## associations

- has_many :reservations
- has_one :rf_score

## Reservations テーブル

| Column      | Type       | Options                        |
| ----------- | ---------- | ------------------------------ |
| customer_id | references | null: false, foreign_key: true |
| visited_at  | datetime   | null: false                    |
| created_at  | datetime   | null: false                    |

## associations

belongs_to :customer

## Rf_scores テーブル

| Column        | Type       | Options                        |
| ------------- | ---------- | ------------------------------ |
| customer_id   | references | null: false, foreign_key: true |
| visit_count   | integer    | null: false                    |
| last_visit_at | datetime   | null: false                    |
| rank          | string     | null: false                    |

## associations

- belongs_to :customer
