class RfScore < ApplicationRecord
  belongs_to :customer

  validates :customer_id, uniqueness: true

end
