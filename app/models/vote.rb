# frozen_string_literal: true

class Vote < ApplicationRecord
  enum vote_type: { upvote: 1, downvote: -1 }
  belongs_to :user
  belongs_to :post

  validates :user_id, uniqueness: { scope: :post_id } # Only one vote per user per post
end
