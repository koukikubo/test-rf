Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :rf_scores, only: [:index]
      resources :customers, only: [:create, :index, :show] 
      resources :reservations, only: [:create, :index, :show]
      resources :rfm_matrices, only: [:index]
      resources :rf_masters, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
