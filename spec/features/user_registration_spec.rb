require 'rails_helper'

RSpec.feature "UserRegistrations", type: :feature do
  scenario 'User signs up and is redirected to the dashboard' do
    visit new_user_registration_path
    fill_in 'user_name', with: 'Test User'
    fill_in 'user_email', with: 'user@example.com'
    fill_in 'user_password', with: 'password'
    fill_in 'user_password_confirmation', with: 'password'
    click_button 'アカウントを登録'
    expect(page).to have_current_path(dashboard_path) 
  end
end
