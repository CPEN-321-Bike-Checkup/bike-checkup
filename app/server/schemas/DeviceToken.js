const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
  token: {type: String, unique: true, required: true},
  owner: {type: mongoose.Schema.Types.Number, ref: 'User', required: true}, // reference
});

const deviceTokenModel = mongoose.model('DeviceToken', deviceTokenSchema);

module.exports.DeviceTokenModel = deviceTokenModel;
module.exports.DeviceTokenSchema = deviceTokenSchema;
