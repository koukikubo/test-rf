class RfMaster < ApplicationRecord
  validates :rank, presence: true, uniqueness: true
  validates :min_visit_count, presence: true
  validates :min_days_since_last_visit, presence: true
  validates :position, presence: true, uniqueness: true
end
