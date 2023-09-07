class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
        has_many :posts
        has_many :projects
        has_many :tasks
        has_many :notifications
        has_many :achievements
        has_many :contributions
        has_many :notes
        has_many :events
        
end
