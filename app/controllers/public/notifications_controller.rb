class Public::NotificationsController < ApplicationController
  
  def index
    @notifications = current_user.notifications.where(read: false)
  end
  
  def update
    @notification = Notification.find(params[:id])
    @notification.update(read: true)
  end
  
end

