class Public::EventsController < ApplicationController
  before_action :set_project
  
  def index
    @events = Event.all
  end
  
  def new
    @event = @project.events.build
  end
  
  def create
    @event = @project.events.build(event_params)
    if @event.save
      redirect_to project_events_path(@project)
    else
      render :new
    end
  end
  
  private
  
  def set_project
    @project = Project.find(params[:project_id])
  end
  
  def event_params
    params.require(:event).permit(:title, :description, :start_time, :end_time)
  end
  
end
