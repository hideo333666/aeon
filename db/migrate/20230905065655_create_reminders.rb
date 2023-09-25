class CreateReminders < ActiveRecord::Migration[6.1]
  def change
    create_table :reminders do |t|
      t.references :event, null: false, foreign_key: true
      t.datetime :time, null: false
      t.text :message, null: false

      t.timestamps
    end
  end
end
