const mongoose = require('mongoose');

const maintenanceItemSchema = new mongoose.Schema({
  _id: Number,
  component_id: {
    type: Schema.Types.ObjectId,
    ref: 'Component'
  },
  maintenance_date: Date,
  replacement_comp_id: Number
});
const MaintenanceItem = mongoose.model('MaintenanceItem', maintenanceItemSchema);