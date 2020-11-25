const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema({
  description: String,
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true,
  },
  maintenance_date: {type: Date, required: true},
});
const maintenanceRecordModel = mongoose.model(
  'MaintenanceRecord',
  maintenanceRecordSchema,
);

module.exports.MaintenanceRecordModel = maintenanceRecordModel;
module.exports.MaintenanceRecordSchema = maintenanceRecordSchema;
