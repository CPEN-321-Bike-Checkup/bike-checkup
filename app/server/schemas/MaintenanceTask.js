const mongoose = require('mongoose');

const maintenanceTaskSchema = new mongoose.Schema({
  description: String,
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true,
  },
  schedule_type: {type: String, required: true},
  threshold_val: {type: Number, required: true},
  last_maintenance_val: {type: Date, required: true},
  repeats: {type: Boolean, required: true},
  predicted_due_date: Date,
});

const maintenanceTaskModel = mongoose.model(
  'MaintenanceTask',
  maintenanceTaskSchema,
);

module.exports.MaintenanceTaskSchema = maintenanceTaskSchema;
module.exports.MaintenanceTaskModel = maintenanceTaskModel;
