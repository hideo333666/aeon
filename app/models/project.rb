class Project < ApplicationRecord

  belongs_to :user
  has_many :tasks
  has_many :notes
  has_many :events

  validates :name, presence: true, length: { minimum: 3, maximum: 50 }
end
