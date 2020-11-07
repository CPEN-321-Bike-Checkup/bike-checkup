const mongoose = require('mongoose');
const { BikeSchema } = require('./Bike');
const { DeviceTokenSchema } = require('./DeviceToken');

const userSchema =  new mongoose.Schema({
	_id: Number,
    bikes: [BikeSchema], //actually stores bike objects
	name: String,
	deviceTokens: [DeviceTokenSchema],
    strava_token: String,
	expires_in: Number,
	refresh_token: String,
	activity_cache_date: Date
});
const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;