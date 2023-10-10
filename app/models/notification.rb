class Notification < ApplicationRecord
  belongs_to :user
  scope :unread, -> { where(read: false) }
  
  def message
    task_name = super.split("Task ").last.split(" is").first
    "タスクの期限がきています\n\t#{task_name}"
  end
  
  validates :message, presence: true
  validates :time, presence: true
  
end
