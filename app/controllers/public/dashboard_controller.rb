class Public::DashboardController < ApplicationController
  def show
    @projects = current_user.projects
    @tasks = current_user.tasks
    @task = Task.new
  end
end
