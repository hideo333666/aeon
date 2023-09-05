class CreateAchievements < ActiveRecord::Migration[6.1]
  def change
    create_table :achievements do |t|
       t.references :user, null: false, foreign_key: true
       t.string :title, null: false
       t.text :description, null: false
       t.datetime :date, null: false
      

      t.timestamps
    end
    
    # 特定ユーザーが同じタイトルの「実績」を持てない制約
    add_index :achievements, [:user_id, :title], unique: true
  end
end
