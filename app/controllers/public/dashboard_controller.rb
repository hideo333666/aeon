class Public::DashboardController < ApplicationController
  before_action :authenticate_user!, only:[:show]
  
  def show
    @projects = current_user.projects
    @task = Task.new

    if params[:project_id].present?
      @selected_project = current_user.projects.find_by(id: params[:project_id])
      if @selected_project
        @tasks = @selected_project.tasks.where(is_checked: false)
      else
        @tasks = []
      end
    else
      @tasks = current_user.tasks.where(is_checked: false)
    end
  end
end

