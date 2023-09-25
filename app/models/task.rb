class Task < ApplicationRecord
  
  belongs_to :user
  belongs_to :project, optional: true
  validates :title, presence: true
  
  before_save :set_default_dates

  private
  
  def set_default_dates
    self.start_date ||= Date.today
    self.end_date ||= Date.today
  end
end
