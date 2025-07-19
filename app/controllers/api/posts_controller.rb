# frozen_string_literal: true

class Api::PostsController < ApplicationController
  def index
    posts = Post.all
    if posts.empty?
      posts = create_sample_posts
    end
    render json: { posts: posts }
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

    def create_sample_posts
      [
        Post.create!(
          title: "Getting Started with Rails",
          description: "Learn the basics of Ruby on Rails framework and build your first web application. " \
            "This comprehensive guide will walk you through setting up your development environment, " \
            "understanding the MVC pattern, and building your first Rails application from scratch.",
          is_bloggable: true
        ),
        Post.create!(
          title: "React and Rails Integration",
          description: "How to integrate React frontend with Rails backend for a modern web application. " \
            "Discover the best practices for building scalable applications using React components and Rails API endpoints.",
          is_bloggable: true
        ),
        Post.create!(
          title: "API Development Best Practices",
          description: "Best practices for designing and implementing RESTful APIs with Rails. " \
            "Learn about proper HTTP status codes, error handling, authentication, and documentation strategies.",
          is_bloggable: true
        )
      ]
    end
end
