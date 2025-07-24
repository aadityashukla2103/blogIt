# frozen_string_literal: true

class Api::PostsController < ApplicationController
  include Pagy::Backend

  def index
    page = params[:page].to_i
    items = params[:items].to_i

    page = 1 if page == 0
    items = 5 if items == 0

    pagy, posts = pagy(
      Post.includes(:user, :categories),
      items: items,
      limit: items,
      page: page
    )

    render json: {
      posts: posts.as_json(include: [:user, :categories]),
      pagy: {
        page: pagy.page,
        items: pagy.vars[:items],
        count: pagy.count,
        pages: pagy.pages,
        prev: pagy.prev,
        next: pagy.next
      }
    }
  end

  def show
    post = Post.find_by_slug(params[:id]) || Post.find(params[:id])
    render json: post
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  def create
    post = Post.new(post_params)
    post.is_bloggable = true # Set to true by default for new posts
    if post.save
      render json: post, status: :created
    else
      render json: { errors: post.errors }, status: :unprocessable_entity
    end
  end

  def update
    post = Post.find_by_slug(params[:id]) || Post.find(params[:id])
    if post.update(post_params)
      render json: post
    else
      render json: { errors: post.errors }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  def destroy
    post = Post.find_by_slug(params[:id]) || Post.find(params[:id])
    post.destroy
    render json: { message: "Post deleted successfully" }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Post not found" }, status: :not_found
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :is_bloggable)
    end
end
