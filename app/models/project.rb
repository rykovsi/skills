# encoding: utf-8

# == Schema Information
#
# Table name: projects
#
#  id          :integer          not null, primary key
#  updated_by  :string
#  description :text
#  title       :text
#  role        :text
#  technology  :text
#  year_from   :integer
#  year_to     :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  person_id   :integer
#

class Project < ApplicationRecord
  belongs_to :person
  validates :year_from, :person_id, :role, :title, :technology, presence: true
  validates :description, length: { maximum: 1000 }
  validates :technology, length: { maximum: 100 }
  validate :year_from_before_year_to
  validates :role, :title, length: { maximum: 50 }

  scope :list, -> { order('year_to IS NOT NULL, year_from desc, year_to desc') }
end
