# == Schema Information
#
# Table name: categories
#
#  id         :bigint(8)        not null, primary key
#  title      :string
#  parent_id  :bigint(8)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CategorySerializer < ApplicationSerializer
  type :categories

  attributes :id, :title, :parent_id
  belongs_to :parent
  has_many :children
end