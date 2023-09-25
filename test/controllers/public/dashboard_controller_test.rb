require "test_helper"

class Public::DashboardControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get public_dashboard_show_url
    assert_response :success
  end
end
