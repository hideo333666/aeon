class Project < ApplicationRecord

  belongs_to :user
  has_many :tasks
  has_many :notes
  has_many :events

  validates :name, presence: true, length: { maximum: 50 }
  
  def self.ransackable_attributes(auth_object = nil)
    ["description", "id", "name", "user_id"]
  end

end
