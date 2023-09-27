require 'rails_helper'

RSpec.describe "Registrations", type: :request do
  describe "POST /users" do
    it "creates a new user and redirects to the dashboard" do
      post user_registration_path, params: {
        user: {
          name: 'Test User',  
          email: 'user@example.com',
          password: 'password',
          password_confirmation: 'password'
        }
      }
      expect(response).to redirect_to(dashboard_path)
    end
  end
end
