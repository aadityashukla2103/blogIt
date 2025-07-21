# frozen_string_literal: true

class AddUserAndOrganizationToPosts < ActiveRecord::Migration[7.1]
  def change
    add_reference :posts, :user, foreign_key: true
    add_reference :posts, :organization, foreign_key: true
  end
end
