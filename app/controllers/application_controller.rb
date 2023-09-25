class ApplicationController < ActionController::Base
  
  def after_sign_up_path_for(resource)
    dashboard_path
  end
  
  def after_sign_in_path_for(resource)
    if resource.is_a?(Admin)
      admin_root_path
    else
      dashboard_path
    end
  end
  
end
