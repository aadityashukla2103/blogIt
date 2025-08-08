# frozen_string_literal: true

class Api::PostsController < Api::ApplicationController
  include Pagy::Backend

  def index
    return render json: { error: "Unauthorized" }, status: :unauthorized unless current_user

    page = params[:page].to_i.presence || 1
    items = params[:items].to_i.presence || 5

    Rails.logger.info "DEBUG: page=#{page}, items=#{items}, params=#{params.inspect}"

    posts = Posts::FilterService.new(current_user, params).perform

    Rails.logger.info "DEBUG: Before pagy - posts.count=#{posts.count}"

    pagy, records = pagy(posts, limit: items, page: page)

    Rails.logger.info "DEBUG: After pagy - pagy.items=#{pagy.vars[:items]}, pagy.count=#{pagy.count}, records.count=#{records.count}"

    render json: {
      posts: records.as_json(include: [:user, :categories]),
      pagy: {
        page: pagy.page,
        items: items,
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
    puts "Received params: #{params.inspect}"
    post = Post.new(post_params)
    post.user = current_user
    post.organization_id = current_user.organization_id
    post.is_bloggable = true
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

  def bulk_update
    posts = Post.where(id: params[:ids])

    posts.each do |post|
      if params[:status] == "published"
        # Set published_at only if it's not already set
        post.update(status: "published", published_at: post.published_at || Time.current)
      else
        post.update(status: params[:status], published_at: nil)
      end
    end

    head :ok
  end

  def bulk_destroy
    Post.where(id: params[:ids]).destroy_all
    head :ok
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :status, :published_at, category_ids: [])
    end
end
