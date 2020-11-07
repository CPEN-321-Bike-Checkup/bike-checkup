const mongoose = require('mongoose');
const bikeSchema = require('./Bike').BikeSchema;
const deviceTokenSchema = require('./DeviceToken').DeviceTokenSchema;

const userSchema = new mongoose.Schema({
  _id: Number,
  bikes: [bikeSchema], //actually stores bike objects
  strava_token: String,
  name: String,
  deviceTokens: [deviceTokenSchema],
});
const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;
