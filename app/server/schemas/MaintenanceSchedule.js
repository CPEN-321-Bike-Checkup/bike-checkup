const mongoose = require('mongoose');

const maintenanceScheduleSchema = new mongoose.Schema({
  _id: Number,
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component'
  },
  schedule_type: String,
  threshold_val: Date,
  description: String,
  last_maintenance_val: Date
});
const maintenanceScheduleModel = mongoose.model('MaintenanceSchedule', maintenanceScheduleSchema);

module.exports.MaintenanceScheduleSchema = maintenanceScheduleSchema;
module.exports.MaintenanceScheduleModel = maintenanceScheduleModel;