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
      redirect_to @task, notice: "タスクの作成に成功しました"
    else
      render :new
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
  
  private
  
  # before_actionで使用
  def set_task
    @task = current_user.tasks.find(params[:id])
  end
  
  def task_params
    params.require(:task).permit(:title, :description, :is_checked, :due_date, ,:priority)
  