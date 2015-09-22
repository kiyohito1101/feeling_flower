class CreateFeelings < ActiveRecord::Migration
  def change
    create_table :feelings do |t|
      t.integer :emotional_states, null: false, default: 0
      t.timestamps null: false
    end
  end
end
