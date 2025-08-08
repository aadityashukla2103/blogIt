# frozen_string_literal: true

module Posts
  class FilterService
    def initialize(user, params)
      @user = user
      @params = params
    end

    def perform
      posts = Post.includes(:user, :categories)
        .where("posts.user_id = ? OR posts.organization_id = ?", @user.id, @user.organization_id)
        .order(created_at: :desc)

      posts = posts.where(status: @params[:status]) if @params[:status].present?

      category_ids = Array(@params[:category_ids])
      if category_ids.present?
        posts = posts.joins(:categories).where(categories: { id: category_ids }).distinct
      end

      posts
    end
  end
end
