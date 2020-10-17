const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    _id: Number,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},// reference
    label: String
});
const BikeModel = mongoose.model('Bike', bikeSchema);