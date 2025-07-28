# frozen_string_literal: true

class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by!(email: login_params[:email].downcase)
    unless @user.authenticate(login_params[:password])
      render_error("Incorrect credentials, try again.", :unauthorized)
    else
      render json: { authentication_token: @user.authentication_token, id: @user.id, name: @user.name }
    end
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
