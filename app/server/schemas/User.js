const mongoose = require('mongoose');
const { BikeSchema } = require('./Bike');
const { DeviceTokenSchema } = require('./DeviceToken');

const userSchema =  new mongoose.Schema({
	_id: Number,
    bikes: [BikeSchema], //actually stores bike objects
    strava_token: String,
	name: String,
	deviceTokens: [DeviceTokenSchema],
});
const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;