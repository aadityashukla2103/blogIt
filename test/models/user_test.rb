# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @user = build(:user)
  end

  test "should be valid" do
    assert @user.valid?
  end

  # Name validations
  test "name should be present" do
    @user.name = ""
    assert_not @user.valid?
    assert_includes @user.errors[:name], "can't be blank"
  end

  test "name should not be nil" do
    @user.name = nil
    assert_not @user.valid?
    assert_includes @user.errors[:name], "can't be blank"
  end

  # Email validations
  test "email should be present" do
    @user.email = ""
    assert_not @user.valid?
    assert_includes @user.errors[:email], "can't be blank"
  end

  test "email should be unique" do
    existing_user = FactoryBot.create(:user, email: "test@example.com")
    duplicate_user = FactoryBot.build(:user, email: "test@example.com")

    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors[:email], "has already been taken"
  end

  test "email should accept valid email format" do
    valid_emails = [
      "user@example.com",
      "user.name@example.com",
      "user+tag@example.com",
      "user@subdomain.example.com"
    ]

    valid_emails.each do |email|
      @user.email = email
      assert @user.valid?, "#{email} should be valid"
    end
  end

  # Password validations
  test "password should be present" do
    @user.password = ""
    @user.password_confirmation = ""
    assert_not @user.valid?
  end

  test "password should have minimum length of 6 characters" do
    @user.password = "12345"
    @user.password_confirmation = "12345"
    assert_not @user.valid?
    assert_includes @user.errors[:password], "is too short (minimum is 6 characters)"
  end

  test "password should be confirmed" do
    @user.password = "password123"
    @user.password_confirmation = "different_password"
    assert_not @user.valid?
    assert_includes @user.errors[:password_confirmation], "doesn't match Password"
  end

  test "password_confirmation should be present" do
    @user.password = "password123"
    @user.password_confirmation = ""
    assert_not @user.valid?
    assert_includes @user.errors[:password_confirmation], "can't be blank"
  end

  # Association tests
  test "should belong to organization" do
    @user.organization = nil
    assert_not @user.valid?
    assert_includes @user.errors[:organization], "must exist"
  end

  test "should have access to organization attributes" do
    organization = FactoryBot.create(:organization, name: "Test Org")
    @user.organization = organization
    @user.save!

    assert_equal "Test Org", @user.organization.name
  end

  # Authentication token tests
  test "should have authentication token" do
    @user.save!
    assert_not_nil @user.authentication_token
    assert @user.authentication_token.length > 0
  end

  test "authentication token should be unique" do
    user1 = FactoryBot.create(:user)
    user2 = FactoryBot.create(:user)

    assert_not_equal user1.authentication_token, user2.authentication_token
  end

  test "should regenerate authentication token" do
    @user.save!
    original_token = @user.authentication_token

    @user.regenerate_authentication_token

    assert_not_equal original_token, @user.authentication_token
    assert_not_nil @user.authentication_token
  end

  # Password authentication tests
  test "should authenticate with correct password" do
    @user.password = "password123"
    @user.password_confirmation = "password123"
    @user.save!

    assert @user.authenticate("password123")
  end

  test "should not authenticate with incorrect password" do
    @user.password = "password123"
    @user.password_confirmation = "password123"
    @user.save!

    assert_not @user.authenticate("wrong_password")
  end

  # Factory tests
  test "factory should create valid user" do
    user = FactoryBot.create(:user)
    assert user.valid?
    assert_not_nil user.name
    assert_not_nil user.email
    assert_not_nil user.authentication_token
  end

  test "factory should create unique emails" do
    user1 = FactoryBot.create(:user)
    user2 = FactoryBot.create(:user)

    assert_not_equal user1.email, user2.email
  end

  # Edge cases
  test "should handle very long names" do
    long_name = "a" * 255
    @user.name = long_name
    assert @user.valid?
  end

  test "should handle very long emails" do
    long_email = "a" * 244 + "@example.com" # Max email length is 254
    @user.email = long_email
    assert @user.valid?
  end

  test "should handle special characters in name" do
    special_names = [
      "José María",
      "Jean-Pierre",
      "O'Connor",
      "Smith-Jones",
      "李小明"
    ]

    special_names.each do |name|
      @user.name = name
      assert @user.valid?, "#{name} should be valid"
    end
  end
end
