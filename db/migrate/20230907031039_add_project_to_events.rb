class AddProjectToEvents < ActiveRecord::Migration[6.1]
  def change
    add_reference :events, :project, null: false, foreign_key: true
  end
end
