const mongoose = require('mongoose');

const maintenanceTaskSchema = new mongoose.Schema({
  	description: String,
  	component_id: {
  	  type: mongoose.Schema.Types.ObjectId,
  	  ref: 'Component'
  	},
  	schedule_type: String,
  	threshold_val: Number,
  	last_maintenance_val: Date,
  	repeats: Boolean
});
const maintenanceTaskModel = mongoose.model('MaintenanceTask', maintenanceTaskSchema);

module.exports.MaintenanceTaskSchema = maintenanceTaskSchema;
module.exports.MaintenanceTaskModel = maintenanceTaskModel;