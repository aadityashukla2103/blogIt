# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
["Tech", "Ruby on Rails"].each do |cat_name|
  Category.find_or_create_by!(name: cat_name)
end

user = User.first
categories = Category.where(name: ["Tech", "Ruby on Rails"])

Post.find_each do |post|
  post.user = user
  post.categories = categories
  post.save!
end
