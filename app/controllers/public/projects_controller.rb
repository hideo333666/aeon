class Public::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  
  def index
    @projects = Project.all
  end
  
  def show
  end
  
  def new 
    @project = Project.new
  end
  
  def create 
    @project = current_user.projects.build(project_params)
    if @project.save
      redirect_to @project, notice: "プロジェクトの作成に成功しました"
    else
      render :new
    end
  end
  
  def edit
  end
  
  def destroy
    @project.desroy
    redirect_to projects_url, notice: "プロジェクトの削除に成功しました"
  end
  
  private
  
    def set_project
      @project = Project.find(params[:id])
    end
    
    def project_params
      params.require(:project).permit(:name, :description)
    end
end
