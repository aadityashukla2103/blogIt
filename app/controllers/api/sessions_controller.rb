# frozen_string_literal: true

class Api::SessionsController < ApplicationController
  def create
    begin
      email = login_params[:email]
      return render_error("Email is required", :unprocessable_entity) if email.blank?

      @user = User.find_by!(email: email.downcase)
      unless @user.authenticate(login_params[:password])
        render_error("Incorrect credentials, try again.", :unauthorized)
      else
        render json: { authentication_token: @user.authentication_token, id: @user.id, name: @user.name }
      end
    rescue ActiveRecord::RecordNotFound
      render_error("User not found", :not_found)
    end
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
