class Public::TasksController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def index
    @tasks = current_user.tasks.all
  end

  def show
  end

  def new
    @task = current_user.tasks.build
  end

  def create
    @task = current_user.tasks.build(task_params)
    if @task.save
      render json: { success: true, message: "タスクの作成に成功しました", task: @task }
    else
      puts "@task.errors.full_messages: #{@task.errors.full_messages}"
      render json: { success: false, message: @task.errors.full_messages }
    end
  end


  def edit
  end

  def update
    if @task.update(task_params)
      redirect_to @task, notice: "タスクの更新に成功しました"
    else
      render :edit
    end
  end

  def destroy
    @task.destroy
    redirect_to tasks_url, notice: "タスクの削除に成功しました"
  end
  
  def toggle
    @task = Task.find(params[:id])
  
    if @task.update(task_params)
      render json: { success: true }
    else
      puts @task.errors.full_messages
      render json: { success: false, error: @task.errors.full_messages.join(', ') }, status: 422
    end
  end

  private

  # before_actionで使用
  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :priority, :is_checked, :project_id)
  end
end
