class RfScore < ApplicationRecord
  belongs_to :customer
  ALLOWED_RANKS = %w[A B C D E Z OUT].freeze

  validates :customer_id, uniqueness: true
  validates :rank, presence: true, inclusion: { in: ALLOWED_RANKS }

end
