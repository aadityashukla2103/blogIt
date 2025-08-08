# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resources :posts, only: [:index, :show, :create, :update, :destroy] do
      collection do
        put "bulk_update"
        delete "bulk_destroy"
      end
    end
    resources :categories, only: [:index, :create]
    resources :users, only: [:index, :create]
    resources :sessions, only: [:create]
    get "me", to: "users#me"
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
