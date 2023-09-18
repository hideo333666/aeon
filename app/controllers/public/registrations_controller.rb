# frozen_string_literal: true

class Public::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  # def new
  #   super
  # end
  def new
   if flash[:form_data]
     @user = User.new(flash[:form_data])
   else
      @user = User.new
    end
  end

  # POST /resource
   def create
     @user = User.new(user_params)
     if @user.save
       @user.send_activation_email
       flash[:info] = "Please check your email to activate your account."
       redirect_to root_url
     else
       flash[:form_data] = user_params
       flash[:error_messages] = @user.errors.full_messages
       redirect_to new_user_registration_path
     end
   end


  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected
  
   def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
   end
  
   def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
   end
   
   def 
    after_sign_up_path_for(resource)
    public_user_path(resource)
   end


  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_up_params
  #   devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  # end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
