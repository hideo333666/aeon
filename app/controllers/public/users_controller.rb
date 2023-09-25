class Public::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, only: [:show, :edit, :update, :destroy]

  def show
    @user = User.find(params[:id])
    unless @user == current_user
      flash[:alert] = "不正なアクセスです"
      redirect_to public_dashboard_path and return
    end
    @events = @user.events
    @events = Event.all
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      redirect_to user_path(@user), notice: 'ユーザー情報が更新されました'
    else
      flash.now[:alert] = "エラーが発生しました"
      render :show
    end
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
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email)
  end
  
end
