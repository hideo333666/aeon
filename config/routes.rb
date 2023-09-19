Rails.application.routes.draw do
  devise_for :admins, path: 'admin'
  
  devise_for :users, controllers: {
    registrations: "public/registrations",
    sessions: 'public/sessions'
  }
  
  root 'homes#top'
  get 'about', to: 'homes#about', as: 'about'
  
  scope module: :public do
    resources :users, only: [:show, :update]
    resources :tasks do
      member do
        patch :toggle
      end
    end
    resources :projects 
      get "dashboard", to: "dashboard#show", as: "dashboard"
      get 'users/:id/contribution', to: 'users#contribution', as: 'user_contribution'
  end
end



