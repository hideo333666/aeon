class Public::NotificationsController < ApplicationController
  
  def index
    @notifications = current_user.notifications.order(created_at: :desc)
    render json: @notifications
  end
  
  def unread_count
    count = current_user.notifications.unread.count
    render json: { count: count }
  end
  
  def mark_as_read
    current_user.notifications.unread.update_all(read: true)
    head :ok
  end
  
end

