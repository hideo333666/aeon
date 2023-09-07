class Project < ApplicationRecord
  
  belongs_to :user
  has_many :tasks
  has_many :notes
  has_many :events
end
