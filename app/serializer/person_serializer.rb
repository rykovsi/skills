# encoding: utf-8

class PersonSerializer < ApplicationSerializer
  type :people

  attributes :id, :birthdate, :language, :picture_path, :location,
             :martial_status, :updated_by, :name, :origin, :role, :title, :competences,
             :origin_person_id, :variation_name, :status_id

  def picture_path
    "/api/people/#{object.id}/picture?#{Time.now}"
  end

  has_many :advanced_trainings do |serializer|
    serializer.object.advanced_trainings.list
  end

  has_many :activities do |serializer|
    serializer.object.activities.list
  end

  has_many :projects do |serializer|
    serializer.object.projects.list
  end

  has_many :educations do |serializer|
    serializer.object.educations.list
  end

  has_many :expertise_topic_skill_values do |serializer|
    serializer.object.expertise_topic_skill_values.list
  end
end
