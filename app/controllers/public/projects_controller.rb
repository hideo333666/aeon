class Public::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

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
      redirect_to dashboard_path, notice: "プロジェクトの作成に成功しました"
    else
      render :new
    end
  end

  def edit
  end

  def update
  respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to projects_path, notice: "プロジェクトの編集に成功しました" }
        format.js   { head :no_content }
      else
        format.html { render :edit }
        format.js   {render plain: "編集に失敗しました", status: :unprocessable_entity }
      end
    end
  end

  
  def destroy
    @project.destroy
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
