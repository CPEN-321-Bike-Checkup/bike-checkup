const mongoose = require('mongoose');

const maintenanceItemSchema = new mongoose.Schema({
  _id: Number,
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
  },
  maintenance_date: Date,
  replacement_comp_id: Number,
});
const maintenanceItemModel = mongoose.model('MaintenanceItem', maintenanceItemSchema);

module.exports.MaintenanceItemModel = maintenanceItemModel;
module.exports.MaintenanceItemSchema = maintenanceItemSchema;
