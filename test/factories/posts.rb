# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    title { Faker::Book.title }
    description { Faker::Lorem.paragraph(sentence_count: 5) }
    upvotes { Faker::Number.between(from: 0, to: 100) }
    downvotes { Faker::Number.between(from: 0, to: 50) }
    is_bloggable { Faker::Boolean.boolean }
    status { "draft" } # or "published", etc.
    published_at { nil } # or Faker::Time.backward(days: 14)
    slug { Faker::Internet.slug }

    # Associations (if User and Organization exist and have factories)
    association :user
    association :organization
  end
end
