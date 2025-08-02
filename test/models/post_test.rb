# frozen_string_literal: true

# test/models/post_test.rb

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @post = build(:post)
  end

  test "should be valid" do
    assert @post.valid?
  end

  # Title validations
  test "title should be present" do
    @post.title = ""
    assert_not @post.valid?
  end

  test "title should not exceed 125 characters" do
    @post.title = "a" * 126
    assert_not @post.valid?
    assert_includes @post.errors[:title], "is too long (maximum is 125 characters)"
  end

  # Description validations
  test "description should be present" do
    @post.description = ""
    assert_not @post.valid?
  end

  test "description should not exceed 10000 characters" do
    @post.description = "a" * 10001
    assert_not @post.valid?
    assert_includes @post.errors[:description], "is too long (maximum is 10000 characters)"
  end

  # Slug validations
  test "slug should be unique" do
    # Create first post with a specific title
    first_post = FactoryBot.create(:post, title: "Hello World")

    # Try to create second post with same title (which will generate same slug)
    second_post = FactoryBot.build(:post, title: "Hello World")

    # The second post should not be valid due to slug uniqueness
    assert_not second_post.valid?
    assert_includes second_post.errors[:slug], "has already been taken"
  end

  test "slug should be generated from title" do
    @post.title = "Hello World Test"
    @post.valid?
    assert_equal "hello-world-test", @post.slug
  end

  test "slug should be updated when title changes" do
    @post.title = "Original Title"
    @post.save!

    @post.title = "Updated Title"
    @post.save!

    assert_equal "updated-title", @post.slug
  end

  # is_bloggable validations
  test "is_bloggable should be true or false" do
    @post.is_bloggable = true
    assert @post.valid?

    @post.is_bloggable = false
    assert @post.valid?

    @post.is_bloggable = nil
    assert_not @post.valid?
    assert_includes @post.errors[:is_bloggable], "is not included in the list"
  end

  # Status enum tests
  test "status should accept draft and published values" do
    @post.status = "draft"
    assert @post.valid?

    @post.status = "published"
    assert @post.valid?
  end

  test "should have draft? and published? methods" do
    @post.status = "draft"
    assert @post.draft?
    assert_not @post.published?

    @post.status = "published"
    assert @post.published?
    assert_not @post.draft?
  end

  # Associations tests
  test "should belong to user optionally" do
    @post.user = nil
    assert @post.valid?
  end

  test "should belong to organization optionally" do
    @post.organization = nil
    assert @post.valid?
  end

  test "should have and belong to many categories" do
    category1 = FactoryBot.create(:category, name: "Technology")
    category2 = FactoryBot.create(:category, name: "Science")

    @post.save!
    @post.categories << category1
    @post.categories << category2

    @post.reload
    assert_equal 2, @post.categories.count
    assert_includes @post.categories, category1
    assert_includes @post.categories, category2
  end

  # Default values tests
  test "should have default values" do
    post = Post.new(title: "Test Title", description: "Test Description")
    post.valid?

    assert_equal 0, post.upvotes
    assert_equal 0, post.downvotes
    assert_equal false, post.is_bloggable
  end

  # as_json method tests
  test "as_json should include correct attributes" do
    user = FactoryBot.create(:user)
    organization = FactoryBot.create(:organization)
    category = FactoryBot.create(:category)

    @post.user = user
    @post.organization = organization
    @post.categories << category
    @post.save!

    json = @post.as_json

    assert_includes json.keys, "id"
    assert_includes json.keys, "title"
    assert_includes json.keys, "description"
    assert_includes json.keys, "slug"
    assert_includes json.keys, "created_at"
    assert_includes json.keys, "updated_at"
    assert_includes json.keys, "status"
    assert_includes json.keys, "published_at"
    assert_includes json.keys, :author
    assert_includes json.keys, :categories

    assert_equal user.name, json[:author]
    assert_includes json[:categories], category.name
  end

  test "as_json should handle nil user gracefully" do
    @post.user = nil
    @post.save!

    json = @post.as_json
    assert_nil json[:author]
  end
end
