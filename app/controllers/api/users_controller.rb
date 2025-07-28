# frozen_string_literal: true

class Api::UsersController < Api::ApplicationController
  def create
    org = Organization.find_or_create_by!(name: user_params[:organization])
    user = User.new(user_params.except(:organization))
    user.organization = org
    user.save!
    render_notice("User was successfully created!")
  end

  def me
    render json: {
      id: current_user.id,
      name: current_user.name,
      email: current_user.email
    }
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :organization)
    end
end
