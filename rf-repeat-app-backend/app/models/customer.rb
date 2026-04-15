class Customer < ApplicationRecord
  has_many :reservations, dependent: :destroy
  has_one :rf_ranking_list, dependent: :destroy

  validates :name, presence: true
end
