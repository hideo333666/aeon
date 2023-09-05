class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description, null: false
      t.boolean :is_checked, null: false, default: false
      t.date :due_date
      t.integer :priority

      t.timestamps
    end
  end
end
