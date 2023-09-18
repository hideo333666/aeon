class Public::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy, :toggle]

  def index
    @tasks = current_user.tasks
  end

  def show
    @hide_header = true
  end

  def new
    @task = current_user.tasks.build
  end

  def create
    @task = current_user.tasks.build(task_params)
    if @task.save
      render json: { success: true, message: "タスクの作成に成功しました", task: @task }
    else
      log_task_errors
      render json: { success: false, message: format_errors(@task.errors) }
    end
  end

  def edit
  end

  def update
    if @task.update(task_params)
      render json: { success: true, message: "タスクの更新に成功しました" }
    else
      log_task_errors
      render json: { success: false, message: format_errors(@task.errors) }, status: 422
    end
  end

  def destroy
    @task.destroy
    redirect_to tasks_url, notice: "タスクの削除に成功しました"
  end

  def toggle
    if @task.update(task_params)
      render json: { success: true }
    else
      log_task_errors
      render json: { success: false, error: format_errors(@task.errors) }, status: 422
    end
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :priority, :is_checked, :start_date, :end_date, :project_id)
  end
  
  def log_task_errors
    Rails.logger.error "Task errors: #{format_errors(@task.errors)}"
  end

  def format_errors(errors)
    errors.full_messages.join(", ")
  end
end

