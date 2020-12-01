const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: {type: String},
  strava_token: {type: String},
  expires_in: {type: Number},
  refresh_token: {type: String},
});

const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;
