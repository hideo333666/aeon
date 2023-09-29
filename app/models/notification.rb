class Notification < ApplicationRecord
  belongs_to :user
  scope :unread, -> { where(read: false) }
  
  validates :message, presence: true
  validates :time, presence: true
  
end
