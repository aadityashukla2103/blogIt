# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    resources :posts, only: [:index, :show, :create, :update, :destroy]
    resources :categories, only: [:index, :create]
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
