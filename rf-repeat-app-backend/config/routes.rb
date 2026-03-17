Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :rf_scores, only: [:index]
      resources :customers, only: [:create, :index, :show] 
      resources :reservations, only: [:create, :index, :show]
      resources :rfm_matrices, only: [:index]
    end
  end
end
