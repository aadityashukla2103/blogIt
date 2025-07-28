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
user = User.second
org = user.organization
category_ids = [1, 2] # IDs of categories like "Frontend", "Ruby"

post = Post.new(
  title: "Getting Started with Rail",
  description: "This post explains the basics of Rails for beginners.",
  user: user,
  organization_id: 2,
  is_bloggable: true
)

post.category_ids = category_ids
post.save!
