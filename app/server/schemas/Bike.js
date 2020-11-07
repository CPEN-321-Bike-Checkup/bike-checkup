const mongoose = require('mongoose');
const { ComponentSchema } = require('./Component');

const bikeSchema = new mongoose.Schema({
	_id: Number,
    owner: {type: mongoose.Schema.Types.Number, ref: 'User'},// reference
	label: String,
	components: [ComponentSchema]
});
const bikeModel = mongoose.model('Bike', bikeSchema);

module.exports.BikeModel = bikeModel;
module.exports.BikeSchema = bikeSchema;