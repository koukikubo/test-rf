Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health", to: "health#index"

      resources :rf_scores, only: [:index]
    end
  end
end
