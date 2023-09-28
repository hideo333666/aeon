class Task < ApplicationRecord

  belongs_to :user
  belongs_to :project, optional: true
  validates :title, presence: true

  before_save :set_default_dates
  after_save :create_notification, if: :deadline_reached? 

  private

  # デフォルトの日付を設定するメソッド
  def set_default_dates
    self.start_date ||= Date.today # start_dateがnillの場合、今日の日付を設定
    self.end_date ||= Date.today   # end_dateがnillの場合、今日の日付を設定
  end

  # 期限が達しているかどうかを確認するメソッド
  def deadline_reached?
    end_date <= Date.today
  end

  # 通知を作成するメソッド
  def create_notification
    Notification.create(
      user: self.user, # 通知を受け取るユーザーを設定
      message: "タスク'#{self.title}'の期限が到達しました",
      time: DateTime.now # 通知時間を設定
      )
  end

end
