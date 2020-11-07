const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema({
	_id: String,
	owner: { type: mongoose.Schema.Types.Number, ref: 'User' },// reference
})

const deviceTokenModel = mongoose.model('DeviceToken', deviceTokenSchema);

module.exports.DeviceTokenModel = deviceTokenModel;
module.exports.DeviceTokenSchema = deviceTokenSchema;
