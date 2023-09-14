class Public::DashboardController < ApplicationController
  
  def show
    @projects = current_user.projects
    @task = Task.new

    if params[:project_id].present?
      @selected_project = Project.find_by(id: params[:project_id])
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

