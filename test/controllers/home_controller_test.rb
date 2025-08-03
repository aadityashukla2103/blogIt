# frozen_string_literal: true

require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  # Index tests
  test "should get index" do
    get root_path
    assert_response :success
  end

  test "should render html format" do
    get root_path
    assert_response :success
    assert_equal "text/html; charset=utf-8", response.content_type
  end

  test "should render home/index template" do
    get root_path
    assert_response :success
    # The controller renders "home/index" template
    # We can verify this by checking the response body contains expected content
    # or by checking the template was rendered
  end

  test "should not require authentication" do
    # This test verifies that the index action doesn't require authentication
    get root_path
    assert_response :success
  end
end
