# frozen_string_literal: true

require "test_helper"

class Api::BaseControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @auth_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token
    }
  end

  # Authentication tests
  test "should authenticate with valid headers" do
  # This test would need a concrete controller that inherits from BaseController
  # For now, we'll test the authentication logic indirectly through other controllers
  get api_me_path, headers: @auth_headers
  assert_response :success
end

  test "should not authenticate without auth headers" do
    get api_me_path
    assert_response :unauthorized
  end

  test "should not authenticate with invalid email" do
  invalid_headers = {
    "X-Auth-Email" => "nonexistent@example.com",
    "X-Auth-Token" => @user.authentication_token
  }

  get api_me_path, headers: invalid_headers
  assert_response :not_found
end

  test "should not authenticate with invalid token" do
    invalid_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => "invalid-token"
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  test "should not authenticate with empty email" do
    invalid_headers = {
      "X-Auth-Email" => "",
      "X-Auth-Token" => @user.authentication_token
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  test "should not authenticate with empty token" do
    invalid_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => ""
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  test "should not authenticate with nil email" do
    invalid_headers = {
      "X-Auth-Token" => @user.authentication_token
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  test "should not authenticate with nil token" do
    invalid_headers = {
      "X-Auth-Email" => @user.email
    }

    get api_me_path, headers: invalid_headers
    assert_response :unauthorized
  end

  # Error rendering tests
  test "should render error with correct status" do
    # Test error rendering through a controller that uses render_error
    # This is tested indirectly through other controller tests
    get api_me_path
    assert_response :unauthorized

    json_response = JSON.parse(response.body)
    assert_includes json_response.keys, "error"
  end
end
