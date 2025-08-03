# frozen_string_literal: true

require "test_helper"

class Api::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @organization = @user.organization
    @category = create(:category)
    @post = create(:post, user: @user, organization: @organization)
    @auth_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token
    }
  end

  # Index tests
  test "should get index with authenticated user" do
    get api_posts_path, headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_includes json_response.keys, "posts"
    assert_includes json_response.keys, "pagy"
  end

  test "should get index with pagination" do
  # Clear existing posts and create multiple posts with unique titles
  Post.destroy_all
  10.times { |i| create(:post, user: @user, organization: @organization, title: "Post #{i}") }

  get api_posts_path, params: { page: 1, items: 5 }, headers: @auth_headers
  assert_response :success

  json_response = JSON.parse(response.body)
  assert_equal 5, json_response["posts"].length
  assert_equal 1, json_response["pagy"]["page"]
  assert_equal 5, json_response["pagy"]["items"]
end

  test "should filter posts by status" do
  # Clear existing posts from setup
  Post.destroy_all

  draft_post = create(:post, user: @user, organization: @organization, status: "draft")
  published_post = create(:post, user: @user, organization: @organization, status: "published")

  get api_posts_path, params: { status: "draft" }, headers: @auth_headers
  assert_response :success

  json_response = JSON.parse(response.body)
  assert_equal 1, json_response["posts"].length
  assert_equal "draft", json_response["posts"].first["status"]
end

  test "should filter posts by category" do
    category1 = create(:category, name: "Technology")
    category2 = create(:category, name: "Science")

    post1 = create(:post, user: @user, organization: @organization)
    post1.categories << category1

    post2 = create(:post, user: @user, organization: @organization)
    post2.categories << category2

    get api_posts_path, params: { category_ids: [category1.id] }, headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal 1, json_response["posts"].length
  end

  test "should return unauthorized without authentication" do
    get api_posts_path
    assert_response :unauthorized
  end

  # Show tests
  test "should show post by id" do
    get api_post_path(@post), headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @post.id, json_response["id"]
  end

  test "should show post by slug" do
    get api_post_path(@post.slug), headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @post.id, json_response["id"]
  end

  test "should return not found for non-existent post" do
    get api_post_path("non-existent-slug"), headers: @auth_headers
    assert_response :not_found
  end

  # Create tests
  test "should create post with valid params" do
  post_params = {
    post: {
      title: Faker::Lorem.sentence,
      description: Faker::Lorem.paragraph,
      status: "draft",
      category_ids: [@category.id]
    }
  }

  assert_difference("Post.count") do
    post api_posts_path, params: post_params, headers: @auth_headers
  end

  assert_response :created

  json_response = JSON.parse(response.body)
  assert_equal post_params[:post][:title], json_response["title"]
  # The response might not include user_id and organization_id in the JSON
  # Let's check if the post was created with the correct associations
  created_post = Post.last
  assert_equal @user.id, created_post.user_id
  assert_equal @organization.id, created_post.organization_id
  assert_equal true, created_post.is_bloggable
end

  test "should not create post with invalid params" do
    post_params = {
      post: {
        title: "",
        description: Faker::Lorem.paragraph
      }
    }

    assert_no_difference("Post.count") do
      post api_posts_path, params: post_params, headers: @auth_headers
    end

    assert_response :unprocessable_entity
  end

  test "should not create post without authentication" do
    post_params = {
      post: {
        title: Faker::Lorem.sentence,
        description: Faker::Lorem.paragraph
      }
    }

    post api_posts_path, params: post_params
    assert_response :unauthorized
  end

  # Update tests
  test "should update post with valid params" do
    new_title = Faker::Lorem.sentence
    update_params = {
      post: {
        title: new_title,
        description: Faker::Lorem.paragraph
      }
    }

    patch api_post_path(@post), params: update_params, headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal new_title, json_response["title"]
  end

  test "should update post by slug" do
    new_title = Faker::Lorem.sentence
    update_params = {
      post: {
        title: new_title
      }
    }

    patch api_post_path(@post.slug), params: update_params, headers: @auth_headers
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal new_title, json_response["title"]
  end

  test "should not update post with invalid params" do
    update_params = {
      post: {
        title: ""
      }
    }

    patch api_post_path(@post), params: update_params, headers: @auth_headers
    assert_response :unprocessable_entity
  end

  test "should return not found when updating non-existent post" do
    update_params = {
      post: {
        title: Faker::Lorem.sentence
      }
    }

    patch api_post_path("non-existent"), params: update_params, headers: @auth_headers
    assert_response :not_found
  end

  # Destroy tests
  test "should destroy post" do
    assert_difference("Post.count", -1) do
      delete api_post_path(@post), headers: @auth_headers
    end

    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal "Post deleted successfully", json_response["message"]
  end

  test "should destroy post by slug" do
    assert_difference("Post.count", -1) do
      delete api_post_path(@post.slug), headers: @auth_headers
    end

    assert_response :success
  end

  test "should return not found when destroying non-existent post" do
    delete api_post_path("non-existent"), headers: @auth_headers
    assert_response :not_found
  end
end
