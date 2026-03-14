class Customer < ApplicationRecord
  has_many :reservations, dependent: :destroy
  has_one :rf_score, dependent: :destroy

  validates :name, presence: true
end

