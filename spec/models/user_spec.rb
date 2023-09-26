require 'rails_helper'

RSpec.describe User, type: :model do
  it 'is valid with a valid email, password, and name' do
    user = User.new(email: 'user@example.com', password: 'password', name: 'Test User')
    expect(user).to be_valid
  end

  it 'is invalid without an email' do
    user = User.new(email: nil)
    user.valid?
    expect(user.errors[:email]).to include("を入力してください")
  end
end


