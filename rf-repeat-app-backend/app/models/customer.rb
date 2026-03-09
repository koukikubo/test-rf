class Customer < ApplicationRecord
  has_many :reservations, dependent: :destroy
end

