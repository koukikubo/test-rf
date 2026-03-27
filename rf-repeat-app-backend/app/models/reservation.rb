class Reservation < ApplicationRecord
  belongs_to :customer

  validates :customer, :visited_at, presence: true

end
