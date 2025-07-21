# frozen_string_literal: true

class Post < ApplicationRecord
  has_and_belongs_to_many :categories
  validates :title, presence: true, length: { maximum: 125 }
  validates :description, presence: true, length: { maximum: 10000 }
  validates_inclusion_of :is_bloggable, in: [true, false]
end
