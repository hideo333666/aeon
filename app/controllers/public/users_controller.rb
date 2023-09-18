class Public::UsersController < ApplicationController
  before_action :authenticate_current_user!, only: [:show, :edit, :update, :destroy]
  
  
  def show
    @user = User.find(params[:id])
    @events = @user.events
    @events = Event.all
  end
  
  def contribution
     user = User.find(params[:id])
    # ユーザーが完了したタスクのend_dateを取得
    completed_tasks_dates = user.tasks.where(is_checked: true).pluck(:end_date)
    # 日付ごとのタスクの完了数を計算
    contributions = completed_tasks_dates.each_with_object(Hash.new(0)) do |date, counts|
      counts[date] += 1
    end
    # 必要なデータをJSONとして返す
    render json: contributions
  end
  
  
end
