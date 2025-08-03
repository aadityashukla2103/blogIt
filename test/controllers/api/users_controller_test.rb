# frozen_string_literal: true

require "test_helper"

class Api::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @auth_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token
    }
  end

  # Create tests
  test "should create user with valid params" do
    user_params = {
      user: {
        name: Faker::Name.name,
        email: Faker::Internet.email,
        password: "password123",
        password_confirmation: "password123",
        organization: Faker::Company.name
      }
    }

    assert_difference("User.count") do
      post api_users_path, params: user_params
    end

    assert_response :created

    json_response = JSON.parse(response.body)
    assert_equal "Signed up successfully", json_response["notice"]
  end

  test "should create user with existing organization" do
    organization = create(:organization)

    user_params = {
      user: {
        name: Faker::Name.name,
        email: Faker::Internet.email,
        password: "password123",
        password_confirmation: "password123",
        organization: organization.name
      }
    }

    assert_difference("User.count") do
      assert_no_difference("Organization.count") do
        post api_users_path, params: user_params
      end
    end

    assert_response :created
  end

  test "should create organization when it doesn't exist" do
    user_params = {
      user: {
        name: Faker::Name.name,
        email: Faker::Internet.email,
        password: "password123",
        password_confirmation: "password123",
        organization: Faker::Company.name
      }
    }

    assert_difference("User.count") do
      assert_difference("Organization.count") do
        post api_users_path, params: user_params
      end
    end

    assert_response :created
  end

  test "should not create user with invalid params" do
    user_params = {
      user: {
        name: "",
        email: "invalid-email",
        password: "short",
        password_confirmation: "different"
      }
    }

    assert_no_difference("User.count") do
      post api_users_path, params: user_params
    end

    assert_response :unprocessable_entity
  end

  test "should not create user without required params" do
    user_params = {
      user: {
        name: Faker::Name.name
      }
    }

    assert_no_difference("User.count") do
      post api_users_path, params: user_params
    end

    assert_response :unprocessable_entity
  end

  # Me tests
  test "should get current user info with authentication" do
  get api_me_path, headers: @auth_headers
  assert_response :success

  json_response = JSON.parse(response.body)
  assert_equal @user.id, json_response["id"]
  assert_equal @user.name, json_response["name"]
  assert_equal @user.email, json_response["email"]
end

  test "should return unauthorized for me without authentication" do
    get api_me_path
    assert_response :unauthorized
  end

  test "should return unauthorized for me with invalid auth headers" do
    invalid_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => "invalid-token"
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  test "should return unauthorized for me with non-existent user" do
  invalid_headers = {
    "X-Auth-Email" => "nonexistent@example.com",
    "X-Auth-Token" => @user.authentication_token
  }

  get api_me_path, headers: invalid_headers
  assert_response :not_found
end
end
