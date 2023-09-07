class Event < ApplicationRecord
  belongs_to :user
  belongs_to :project, optional: true
  has_many :reminder
  
end
