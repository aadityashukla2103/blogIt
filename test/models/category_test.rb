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

  test "name should be present" do
    @category.name = ""
    assert_not @category.valid?
  end

  test "name should be unique" do
    create(:category, name: "Tech")
    duplicate = build(:category, name: "Tech")
    assert_not duplicate.valid?
  end
end
