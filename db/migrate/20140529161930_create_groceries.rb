class CreateGroceries < ActiveRecord::Migration
  def change
    create_table :groceries do |t|
      t.string :item
      t.float :price
      t.boolean :healthy
      t.boolean :bought

      t.timestamps
    end
  end
end
