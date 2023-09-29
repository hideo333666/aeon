Rails.application.routes.draw do
  devise_for :admins, controllers: {
    sessions: "admin/sessions"
  }
  
  devise_for :users, controllers: {
    registrations: "public/registrations",
    sessions: "public/sessions"
  }
  
  root "homes#top"
  get "about", to: "homes#about", as: "about"
  
  namespace :admin do
    root to: "users#index"
    resources :users, only: [:index, :destroy]
  end
  
  scope module: :public do
    resources :users, only: [:show, :update, :destroy]
    resources :tasks do
      member do
        patch :toggle
      end
    end
    resources :projects
    resources :notifications, only: [:index, :update]
    get "dashboard", to: "dashboard#show", as: "dashboard"
    get "users/:id/contribution", to: "users#contribution", as: "user_contribution"
    post "validate_project", to: "projects#validate"
  end
end



