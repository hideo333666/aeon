class Project < ApplicationRecord

  belongs_to :user
  has_many :tasks
  has_many :notes
  has_many :events

  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :description, length: { minimum: 2, maximum: 1000, allow_blank: true }
    
  def self.ransackable_attributes(auth_object = nil)
    ["description", "id", "name", "user_id"]
  end

end
