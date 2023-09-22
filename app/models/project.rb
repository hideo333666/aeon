class Project < ApplicationRecord

  belongs_to :user
  has_many :tasks
  has_many :notes
  has_many :events

  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :description, presence: true, length: { minimum: 2, maximum: 1000 }
    
  def self.ransackable_attributes(auth_object = nil)
    ["description", "id", "name", "user_id"]
  end

end
