# frozen_string_literal: true

class User < ApplicationRecord
  belongs_to :organization
  has_many :votes, dependent: :destroy

  has_secure_password
  has_secure_token :authentication_token

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, confirmation: true, length: { minimum: 6 }
  validates :password_confirmation, presence: true
end
