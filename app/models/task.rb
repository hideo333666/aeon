class Task < ApplicationRecord
  
  belongs_to :user
  belongs_to :project, optional: true
  validates :title, presence: true
  
   validate :end_date_after_start_date

    private
  
    def end_date_after_start_date
      if end_date && start_date && end_date < start_date
        errors.add(:end_date, "は開始日より後の日付を選択してください")
      end
    end
 
end
