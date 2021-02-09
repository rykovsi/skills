class CreateBranchAdresses < ActiveRecord::Migration[6.0]
  def change
    create_table :branch_adresses do |t|
      t.string :short_name
      t.string :adress_information
      t.string :country

      t.timestamps
    end
  end
end
