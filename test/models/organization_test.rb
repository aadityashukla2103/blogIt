# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  test "should be valid" do
    assert @organization.valid?
  end

  # Name validations
  test "name should be present" do
    @organization.name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors[:name], "can't be blank"
  end

  test "name should not be nil" do
    @organization.name = nil
    assert_not @organization.valid?
    assert_includes @organization.errors[:name], "can't be blank"
  end

  test "name should be unique" do
    existing_org = FactoryBot.create(:organization, name: "Test Organization")
    duplicate_org = FactoryBot.build(:organization, name: "Test Organization")

    assert_not duplicate_org.valid?
    assert_includes duplicate_org.errors[:name], "has already been taken"
  end

  # Association tests
  test "should have many users" do
    @organization.save!

    user1 = FactoryBot.create(:user, organization: @organization)
    user2 = FactoryBot.create(:user, organization: @organization)

    assert_equal 2, @organization.users.count
    assert_includes @organization.users, user1
    assert_includes @organization.users, user2
  end

  test "should have access to user attributes" do
    @organization.save!
    user = FactoryBot.create(:user, organization: @organization, name: "John Doe")

    assert_equal "John Doe", @organization.users.first.name
  end

  test "should be destroyed when all users are destroyed" do
    @organization.save!
    user = FactoryBot.create(:user, organization: @organization)

    user.destroy
    @organization.reload

    # Organization should still exist since it's not dependent on users
    assert Organization.exists?(@organization.id)
  end

  # Factory tests
  test "factory should create valid organization" do
    organization = FactoryBot.create(:organization)
    assert organization.valid?
    assert_not_nil organization.name
  end

  test "factory should create unique names" do
    org1 = FactoryBot.create(:organization)
    org2 = FactoryBot.create(:organization)

    assert_not_equal org1.name, org2.name
  end

  # Edge cases
  test "should handle very long names" do
    long_name = "a" * 255
    @organization.name = long_name
    assert @organization.valid?
  end

  test "should handle special characters in name" do
    special_names = [
      "Acme & Co.",
      "Smith-Jones Corp",
      "O'Connor Industries",
      "José María Enterprises",
      "Test Organization (LLC)",
      "Company Name with Spaces"
    ]

    special_names.each do |name|
      @organization.name = name
      assert @organization.valid?, "#{name} should be valid"
    end
  end

  test "should handle names with numbers" do
    names_with_numbers = [
      "Company 123",
      "Test Corp 2024",
      "Organization 1st",
      "2nd Best Company"
    ]

    names_with_numbers.each do |name|
      @organization.name = name
      assert @organization.valid?, "#{name} should be valid"
    end
  end

  # Database constraints
  test "should enforce not null constraint on name" do
    @organization.name = nil
    assert_raises(ActiveRecord::RecordInvalid) do
      @organization.save!
    end
  end

  # Scopes and queries (if any are added in the future)
  test "should be findable by name" do
    @organization.save!
    found_org = Organization.find_by(name: @organization.name)
    assert_equal @organization, found_org
  end

  test "should be orderable by name" do
    org1 = FactoryBot.create(:organization, name: "Zebra Corp")
    org2 = FactoryBot.create(:organization, name: "Alpha Corp")
    org3 = FactoryBot.create(:organization, name: "Beta Corp")

    ordered_orgs = Organization.order(:name)
    assert_equal "Alpha Corp", ordered_orgs.first.name
    assert_equal "Zebra Corp", ordered_orgs.last.name
  end
end
