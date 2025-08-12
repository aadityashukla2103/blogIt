# frozen_string_literal: true

json.posts @records do |post|
  json.extract! post, :id, :title, :description, :status, :slug,
    :upvotes, :downvotes, :created_at, :updated_at

  json.user do
    json.extract! post.user, :id, :name, :email
  end

  json.categories post.categories do |category|
    json.extract! category, :id, :name
  end
end

json.pagy do
  json.page @pagy.page
  json.items @items
  json.count @pagy.count
  json.pages @pagy.pages
  json.prev @pagy.prev
  json.next @pagy.next
end
