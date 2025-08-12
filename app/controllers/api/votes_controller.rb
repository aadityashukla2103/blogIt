# frozen_string_literal: true

class Api::VotesController < Api::ApplicationController
  before_action :authenticate_user_using_x_auth_token

  def create
    post = Post.find(params[:post_id])
    vote_type = vote_params[:vote_type] # "upvote" or "downvote"

    Post.transaction do
      vote = post.votes.find_or_initialize_by(user: current_user)

      if vote.vote_type == vote_type
        # Same vote clicked again → remove it
        adjust_vote_count(post, vote_type, :decrement)
        vote.destroy!
      else
        # Different vote or first time voting
        if vote.persisted?
          adjust_vote_count(post, vote.vote_type, :decrement) # remove old vote
        end
        vote.update!(vote_type: vote_type) # save new vote
        adjust_vote_count(post, vote_type, :increment) # use param directly
      end

      post.update_bloggable_status
    end

    render json: {
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      net_votes: post.upvotes - post.downvotes,
      user_vote: post.votes.find_by(user: current_user)&.vote_type,
      is_bloggable: post.is_bloggable
    }
  end

  private

    def vote_params
      params.require(:vote).permit(:vote_type)
    end

    def adjust_vote_count(post, vote_type, action)
      return if vote_type.blank?

      case vote_type
      when "upvote"
        post.increment!(:upvotes) if action == :increment
        post.decrement!(:upvotes) if action == :decrement && post.upvotes > 0
      when "downvote"
        post.increment!(:downvotes) if action == :increment
        post.decrement!(:downvotes) if action == :decrement && post.downvotes > 0
      end
    end
end
