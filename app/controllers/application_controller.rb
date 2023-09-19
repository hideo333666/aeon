class ApplicationController < ActionController::Base
  def after_sign_up_path_for(resource)
    public_dashboard_path
  end
  
  def after_sign_in_path_for(resource)
    public_dashboard_path
  end
end
