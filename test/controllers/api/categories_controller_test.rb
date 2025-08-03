# frozen_string_literal: true

require "test_helper"

class Api::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @category = create(:category)
  end

  # Index tests
  test "should get index" do
    # Create additional categories
    3.times { create(:category) }

    get api_categories_path
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal 4, json_response.length # 3 new + 1 from setup
  end

  test "should get empty index when no categories exist" do
    Category.destroy_all

    get api_categories_path
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal 0, json_response.length
  end

  # Create tests
  test "should create category with valid params" do
    category_params = {
      category: {
        name: Faker::Lorem.word.capitalize
      }
    }

    assert_difference("Category.count") do
      post api_categories_path, params: category_params
    end

    assert_response :created

    json_response = JSON.parse(response.body)
    assert_equal category_params[:category][:name], json_response["name"]
  end

  test "should not create category with empty name" do
    category_params = {
      category: {
        name: ""
      }
    }

    assert_no_difference("Category.count") do
      post api_categories_path, params: category_params
    end

    assert_response :unprocessable_entity

    json_response = JSON.parse(response.body)
    assert_includes json_response["errors"], "Name can't be blank"
  end

  test "should not create category with duplicate name" do
    existing_category = create(:category, name: "Technology")

    category_params = {
      category: {
        name: "Technology"
      }
    }

    assert_no_difference("Category.count") do
      post api_categories_path, params: category_params
    end

    assert_response :unprocessable_entity

    json_response = JSON.parse(response.body)
    assert_includes json_response["errors"], "Name has already been taken"
  end

  test "should not create category without name parameter" do
  category_params = {
    category: {}
  }

  assert_no_difference("Category.count") do
    post api_categories_path, params: category_params
  end

  assert_response :bad_request
end

  test "should not create category without category parameter" do
    assert_no_difference("Category.count") do
      post api_categories_path, params: {}
    end

    assert_response :bad_request
  end

  test "should create category with long name" do
    long_name = "a" * 100 # Test with a long name
    category_params = {
      category: {
        name: long_name
      }
    }

    assert_difference("Category.count") do
      post api_categories_path, params: category_params
    end

    assert_response :created

    json_response = JSON.parse(response.body)
    assert_equal long_name, json_response["name"]
  end
end
