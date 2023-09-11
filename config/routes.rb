Rails.application.routes.draw do
  namespace :public do
    get 'dashboard/show'
  end
  # 管理者用のDeviseルーティング。パスに'admin'を指定。
  devise_for :admins, path: 'admin'
  # ユーザー用のDeviseルーティング。
  devise_for :users

  # 管理者用のルートは名前空間（namespace）またはスコープ（scope）内で定義可能。
  # namespace :admin do
  #   resources :何らかのリソース
  # end
  scope module: :public do
    root 'homes#top'
    get 'about' => 'homes#about', as: 'about'
    resources :users, only: [:show, :update]
    resources :tasks do
      member do
        patch :toggle
       end
      end
    resources :projects do
      resources :events
    end
  end

  get 'top' => 'homes#top'
  get "dashboard", to: "dashboard#show", as: "dashboard"
end
