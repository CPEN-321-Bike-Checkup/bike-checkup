const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  bike_id: {type: mongoose.Schema.Types.String, ref: 'Bike', required: true}, //reference to Bike
  label: String,
  attachment_date: {type: Date, required: true},
  removal_date: Date,
});

const componentModel = mongoose.model('Component', componentSchema);

module.exports.ComponentModel = componentModel;
module.exports.ComponentSchema = componentSchema;
