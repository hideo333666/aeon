class Public::ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  def index
    @projects = Project.all
    @q =  current_user.projects.ransack(params[:q])
    @projects = @q.result
  end

  def show
  end

  def new
    @project = Project.new
  end

  def create
    @project = current_user.projects.build(project_params)
    if @project.save
      respond_to do |format|
        format.html { redirect_to dashboard_path, notice: "プロジェクトの作成に成功しました" }
        format.json { render json: { status: "success", message: "プロジェクトの作成に成功しました" } }
      end
    else
      respond_to do |format|
        format.html { redirect_to projects_path, alert: @project.errors.full_messages.join(",") }
        format.json do
          # Log the error messages
          Rails.logger.info @project.errors.messages.inspect
          render json: {
            status: "error",
            errors: {
              name: @project.errors.full_messages_for(:name),
              description: @project.errors.full_messages_for(:description)
            }
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def edit
  end

  def update
    if @project.update(project_params)
      respond_to do |format|
        format.html { redirect_to projects_path, notice: "プロジェクトの編集に成功しました" }
        format.json { render json: { status: "success" }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { redirect_to projects_path, alert: @project.errors.full_messages.join(",") }
        format.json do
          render json: {
            status: "error",
            errors: format_errors(@project)
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def validate
    project = Project.new(project_params)
    if project.valid?
      render json: { valid: true }
    else
      flash[:error_messages] = project.errors.full_messages
      render json: { errors: project.errors.messages }, status: :unprocessable_entity
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

  def format_errors(model)
    errors_hash = {}
    model.errors.messages.each do |attribute, errors|
      field_name = model.class.human_attribute_name(attribute)
      errors_hash[attribute] = errors.map { |error_message| "#{field_name} #{error_message}" }.join(", ")
    end
    errors_hash
  end
end
