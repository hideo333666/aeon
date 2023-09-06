class Task < ApplicationRecord
  
  belongs_to :user
  validates :title, presence: true
  
  # 過去の日付は許可しない
  validate :due_date_cannot_be_in_the_past
  
  def due_date_cannot_be_in_the_past
    if due_date.present? && due_date < Date.today
      errors.add(:due_date, "は今日以降の日付を設定してください")
    end
  end
end
