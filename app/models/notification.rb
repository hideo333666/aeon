class Notification < ApplicationRecord
  belongs_to :user
  validates :message, presence: true
  validates :time, presence: true
end
