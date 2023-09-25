# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Admin.find_or_create_by!(email: 'testadmin@example.com') do |admin|
  admin.password = 'password'
  admin.password_confirmation = 'password'
end

taro = User.find_or_create_by!(email: "taro@example.com") do |user|
  user.name = "Taro"
  user.password = "password"
end

ziro = User.find_or_create_by!(email: "ziro@example.com") do |user|
  user.name = "Ziro"
  user.password = "password"
end

koziro = User.find_or_create_by!(email: "Koziro@example.com") do |user|
  user.name = "Koziro"
  user.password = "password"
end

projects = [taro, ziro, koziro].map do |user|
  Project.create!(name: "#{user.name}'s Project", user: user)
end

user = taro

projects.each do |project|
  5.times do |i|
    Task.find_or_create_by!(title: "Task #{i + 1} for #{project.name}", project: project, user: user) do |task|
      task.description = "Description for Task #{i + 1} for #{project.name}"
      task.start_date = Date.today
      task.end_date = Date.today + (i + 1).days 
    end
  end
end

  