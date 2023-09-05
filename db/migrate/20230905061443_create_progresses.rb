class CreateProgresses < ActiveRecord::Migration[6.1]
  def change
    create_table :progresses do |t|
      t.references :task, null: false, foreign_key: true
      t.integer :percentage, null: false, default: 0

      t.timestamps
    end

  end
end
