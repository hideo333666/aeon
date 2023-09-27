FactoryBot.define do
  factory :user do
    email { 'user@example.com' }
    password { 'password' }
    sequence(:name) { |n| "User #{n}" }
  end
end
