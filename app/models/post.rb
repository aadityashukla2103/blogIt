# frozen_string_literal: true

class Post < ApplicationRecord
  enum status: { draft: "draft", published: "published" }
  belongs_to :user, optional: true
  belongs_to :organization, optional: true
  has_and_belongs_to_many :categories
  has_many :votes, dependent: :destroy
  validates :title, presence: true, length: { maximum: 125 }
  validates :description, presence: true, length: { maximum: 10000 }
  validates_inclusion_of :is_bloggable, in: [true, false]
  validates :slug, uniqueness: true

  before_validation :generate_slug, on: [:create, :update]

  def as_json(options = {})
    super(
      options.merge(
        only: [:id, :title, :description, :slug, :created_at, :updated_at, :status,
        :published_at])).merge(
          {
            author: user&.name,
            categories: categories.pluck(:name)
          })
  end

  def update_bloggable_status
    if net_votes > Rails.configuration.x.vote_threshold
      update(is_bloggable: true)
    else
      update(is_bloggable: false)
    end
  end

  def net_votes
    votes.sum(:vote_type) # because upvote=1, downvote=-1
  end

  private

    def generate_slug
      self.slug = title.parameterize if title.present?
    end
end
