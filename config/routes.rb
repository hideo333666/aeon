Rails.application.routes.draw do
  devise_for :admins
  devise_for :users
  
  namespace :public do
    resources :users, only:[:show, :update]
  end
end
