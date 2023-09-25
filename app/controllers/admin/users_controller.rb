class Admin::UsersController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_user, only: [:destroy]
  
  def index
    @users = User.all
  end
  
  def destroy
    @user.destroy
    redirect_to admin_users_path, notice: "ユーザーが削除されました"
  end
  
  private
  
  def set_user
    @user = User.find(params[:id])
  end
  
  def authenticate_admin!
    unless current_admin
      flash[:alert] = "管理者権限が必要です"
      redirect_to root_path
    end
  end
end
