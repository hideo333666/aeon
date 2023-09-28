class Public::NotificationsController < ApplicationController
  
  def index
    @notifications = current_user.notifications.order(created_at: :desc)
    render json: { count: @notifications.count }
  end
end
