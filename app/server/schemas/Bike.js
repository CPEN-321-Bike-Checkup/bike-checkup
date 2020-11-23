const mongoose = require('mongoose');
const {ComponentSchema} = require('./Component');

const bikeSchema = new mongoose.Schema({
  _id: String,
  owner_id: {type: mongoose.Schema.Types.Number, ref: 'User', required: true}, // reference
  label: String,
  distance: Number,
});
const bikeModel = mongoose.model('Bike', bikeSchema);

module.exports.BikeModel = bikeModel;
module.exports.BikeSchema = bikeSchema;
