# frozen_string_literal: true

class ChangeVoteTypeToIntegerInVotes < ActiveRecord::Migration[7.0]
  def change
    change_column :votes, :vote_type, :integer, using: "vote_type::integer"
  end
end
