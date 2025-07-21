# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :name

      t.timestamps
    end

    create_join_table :categories, :posts do |t|
      t.index :category_id
      t.index :post_id
    end
  end
end
