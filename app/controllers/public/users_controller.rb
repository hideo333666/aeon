class Public::UsersController < ApplicationController
  
  def show
    @user = User.find(params[:id])
    @events = @user.events
    @events = Event.all
  end
  
  
  
end
