# frozen_string_literal: true

# test/models/category_test.rb

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  test "should be valid" do
    assert @category.valid?
  end

  # Name validations
  test "name should be present" do
    @category.name = ""
    assert_not @category.valid?
    assert_includes @category.errors[:name], "can't be blank"
  end

  test "name should not be nil" do
    @category.name = nil
    assert_not @category.valid?
    assert_includes @category.errors[:name], "can't be blank"
  end

  test "name should be unique" do
    existing_category = FactoryBot.create(:category, name: "Technology")
    duplicate_category = FactoryBot.build(:category, name: "Technology")

    assert_not duplicate_category.valid?
    assert_includes duplicate_category.errors[:name], "has already been taken"
  end

  # Association tests
  test "should have and belong to many posts" do
    @category.save!

    post1 = FactoryBot.create(:post, title: "Post 1")
    post2 = FactoryBot.create(:post, title: "Post 2")

    @category.posts << post1
    @category.posts << post2

    assert_equal 2, @category.posts.count
    assert_includes @category.posts, post1
    assert_includes @category.posts, post2
  end

  test "should have access to post attributes" do
    @category.save!
    post = FactoryBot.create(:post, title: "Test Post")

    @category.posts << post

    assert_equal "Test Post", @category.posts.first.title
  end

  test "should be accessible from posts" do
    @category.save!
    post = FactoryBot.create(:post)

    post.categories << @category

    assert_includes post.categories, @category
    assert_equal @category.name, post.categories.first.name
  end

  test "should handle multiple categories per post" do
    category1 = FactoryBot.create(:category, name: "Technology")
    category2 = FactoryBot.create(:category, name: "Science")
    post = FactoryBot.create(:post)

    post.categories << category1
    post.categories << category2

    assert_equal 2, post.categories.count
    assert_includes post.categories, category1
    assert_includes post.categories, category2
  end

  test "should handle multiple posts per category" do
    @category.save!
    post1 = FactoryBot.create(:post, title: "Post 1")
    post2 = FactoryBot.create(:post, title: "Post 2")
    post3 = FactoryBot.create(:post, title: "Post 3")

    @category.posts << post1
    @category.posts << post2
    @category.posts << post3

    assert_equal 3, @category.posts.count
    assert_includes @category.posts, post1
    assert_includes @category.posts, post2
    assert_includes @category.posts, post3
  end

  # Factory tests
  test "factory should create valid category" do
    category = FactoryBot.create(:category)
    assert category.valid?
    assert_not_nil category.name
  end

  test "factory should create unique names" do
    cat1 = FactoryBot.create(:category)
    cat2 = FactoryBot.create(:category)

    assert_not_equal cat1.name, cat2.name
  end

  # Edge cases
  test "should handle very long names" do
    long_name = "a" * 255
    @category.name = long_name
    assert @category.valid?
  end

  test "should handle special characters in name" do
    special_names = [
      "Science & Technology",
      "Health & Wellness",
      "Arts & Culture",
      "Business & Finance",
      "Sports & Recreation",
      "Food & Drink"
    ]

    special_names.each do |name|
      @category.name = name
      assert @category.valid?, "#{name} should be valid"
    end
  end

  test "should handle names with numbers" do
    names_with_numbers = [
      "Technology 2.0",
      "Science 101",
      "Business 360",
      "Health 24/7"
    ]

    names_with_numbers.each do |name|
      @category.name = name
      assert @category.valid?, "#{name} should be valid"
    end
  end

  test "should handle single character names" do
    @category.name = "A"
    assert @category.valid?
  end

  # Database constraints
  test "should enforce not null constraint on name" do
    @category.name = nil
    assert_raises(ActiveRecord::RecordInvalid) do
      @category.save!
    end
  end

  # Scopes and queries
  test "should be findable by name" do
    @category.save!
    found_category = Category.find_by(name: @category.name)
    assert_equal @category, found_category
  end

  test "should be orderable by name" do
    cat1 = FactoryBot.create(:category, name: "Zebra")
    cat2 = FactoryBot.create(:category, name: "Alpha")
    cat3 = FactoryBot.create(:category, name: "Beta")

    ordered_categories = Category.order(:name)
    assert_equal "Alpha", ordered_categories.first.name
    assert_equal "Zebra", ordered_categories.last.name
  end

  test "should be searchable by name" do
    @category.save!
    found_categories = Category.where("name LIKE ?", "%#{@category.name}%")
    assert_includes found_categories, @category
  end

  # Association edge cases
  test "should handle removing posts from category" do
    @category.save!
    post = FactoryBot.create(:post)
    @category.posts << post

    assert_equal 1, @category.posts.count

    @category.posts.delete(post)
    @category.reload

    assert_equal 0, @category.posts.count
  end

  test "should handle clearing all posts from category" do
    @category.save!
    post1 = FactoryBot.create(:post)
    post2 = FactoryBot.create(:post)

    @category.posts << post1
    @category.posts << post2

    assert_equal 2, @category.posts.count

    @category.posts.clear
    @category.reload

    assert_equal 0, @category.posts.count
  end

  test "should handle category with no posts" do
    @category.save!
    assert_equal 0, @category.posts.count
  end
end
