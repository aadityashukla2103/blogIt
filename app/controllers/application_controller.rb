# frozen_string_literal: true

class ApplicationController < ActionController::Base
  # previous code

  private

    # previous code

    def render_error(message, status = :unprocessable_entity)
      render json: { error: message }, status: status
    end

    def render_notice(message, status = :ok)
      render json: { notice: message }, status: status
    end
end
