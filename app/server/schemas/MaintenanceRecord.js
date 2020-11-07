const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema({
	description: String,
  	component_id: {
  	  type: mongoose.Schema.Types.ObjectId,
  	  ref: 'Component'
  	},
  	maintenance_date: Date,
  	replacement_comp_id: Number
});
const maintenanceRecordModel = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);

module.exports.MaintenanceRecordModel = maintenanceRecordModel;
module.exports.MaintenanceRecordSchema = maintenanceRecordSchema;