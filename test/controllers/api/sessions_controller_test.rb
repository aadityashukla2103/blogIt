# frozen_string_literal: true

require "test_helper"

class Api::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user, password: "password123", password_confirmation: "password123")
  end

  # Create tests
  test "should create session with valid credentials" do
    login_params = {
      login: {
        email: @user.email,
        password: "password123"
      }
    }

    post api_sessions_path, params: login_params
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_includes json_response.keys, "authentication_token"
    assert_includes json_response.keys, "id"
    assert_includes json_response.keys, "name"
    assert_equal @user.authentication_token, json_response["authentication_token"]
    assert_equal @user.id, json_response["id"]
    assert_equal @user.name, json_response["name"]
  end

  test "should create session with email case insensitive" do
    login_params = {
      login: {
        email: @user.email.upcase,
        password: "password123"
      }
    }

    post api_sessions_path, params: login_params
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @user.authentication_token, json_response["authentication_token"]
  end

  test "should not create session with incorrect password" do
    login_params = {
      login: {
        email: @user.email,
        password: "wrongpassword"
      }
    }

    post api_sessions_path, params: login_params
    assert_response :unauthorized

    json_response = JSON.parse(response.body)
    assert_equal "Incorrect credentials, try again.", json_response["error"]
  end

  test "should not create session with non-existent email" do
  login_params = {
    login: {
      email: "nonexistent@example.com",
      password: "password123"
    }
  }

  post api_sessions_path, params: login_params
  assert_response :not_found
end

  test "should not create session without email" do
  login_params = {
    login: {
      password: "password123"
    }
  }

  post api_sessions_path, params: login_params
  assert_response :unprocessable_entity

  json_response = JSON.parse(response.body)
  assert_equal "Email is required", json_response["error"]
end

  test "should not create session without password" do
    login_params = {
      login: {
        email: @user.email
      }
    }

    post api_sessions_path, params: login_params
    assert_response :unauthorized
  end

  test "should not create session with empty params" do
    post api_sessions_path, params: {}
    assert_response :bad_request
  end
end
