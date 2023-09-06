class Public::EventsController < ApplicationController
  
  def index
    @events = Event.all
  end
  
end
