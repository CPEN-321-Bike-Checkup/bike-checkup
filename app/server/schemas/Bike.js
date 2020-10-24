const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    _id: Number,
    owner: {type: mongoose.Schema.Types.Number, ref: 'User'},// reference
    label: String
});
const BikeModel = mongoose.model('Bike', bikeSchema);

module.exports.BikeModel = BikeModel;
module.exports.BikeSchema = bikeSchema;