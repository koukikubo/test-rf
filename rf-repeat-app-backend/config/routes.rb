Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :rf_ranking_lists, only: [:index]
      resources :customers, only: [:create, :index, :show] 
      resources :reservations, only: [:create, :index, :show, :update, :destroy]
      resources :rf_transitions, only: [:index]
      resources :rf_masters, only: [:index]
      resources :rf_rank_summaries, only: [:index]
      resources :rf_rank_fluctuations, only: [:index]
    end
  end
end
