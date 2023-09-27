require 'rails_helper'

RSpec.feature "TaskCreations", type: :feature do
  let(:user) { create(:user) }  
  let(:project) { create(:project) }

  before do
    sign_in user
    visit new_task_path
  end

  scenario "User creates a new task" do
    select '関連プロジェクト', from: 'task[project_id]'
    fill_in 'タイトル', with: '新しいタスク'
    fill_in '説明', with: 'タスクの説明'
    fill_in '期間', with: '2023-09-25 - 2023-09-26'

    click_button 'Submit'

    expect(page).to have_content('タスクの作成に成功しました')

    task = Task.last
    expect(task.title).to eq '新しいタスク'
    expect(task.description).to eq 'タスクの説明'
    expect(task.start_date).to eq Date.parse('2023-09-25')
    expect(task.end_date).to eq Date.parse('2023-09-26')
  end
end
