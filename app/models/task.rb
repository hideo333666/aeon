class Task < ApplicationRecord

  belongs_to :user
  belongs_to :project, optional: true
  validates :title, presence: true

  before_save :set_default_dates
  after_save :check_due_date

  private

  # デフォルトの日付を設定するメソッド
  def set_default_dates
    self.start_date ||= Date.today # start_dateがnillの場合、今日の日付を設定
    self.end_date ||= Date.today   # end_dateがnillの場合、今日の日付を設定
  end

  # 期限が達しているかどうかを確認するメソッド
  def check_due_date
    if end_date == Date.today
      Notification.create(user_id: self.user_id, message: "Task #{self.title} is due today", time: DateTime.now)
    end
  end
end
