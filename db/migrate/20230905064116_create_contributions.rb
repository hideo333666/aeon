class CreateContributions < ActiveRecord::Migration[6.1]
  def change
    create_table :contributions do |t|
       t.references :user, null: false, foreign_key: true
       t.integer :point, null: false, default: 0

      t.timestamps
    end
  end
end
