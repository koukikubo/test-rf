class RfMaster < ApplicationRecord
ALLOWED_RANKS = %w[A B C D E Z OUT].freeze

  validates :rank, presence: true, uniqueness: true, inclusion: { in: ALLOWED_RANKS }

  validates :max_visit_count,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 },
            allow_nil: true

  validates :position,
            presence: true,
            uniqueness: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
