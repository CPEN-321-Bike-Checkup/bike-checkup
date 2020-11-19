const mongoose = require('mongoose');
const {BikeSchema} = require('./Bike');
const {DeviceTokenSchema} = require('./DeviceToken');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  strava_token: String,
  expires_in: Number,
  refresh_token: String,
  activity_cache_date: Date,
});
const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;
