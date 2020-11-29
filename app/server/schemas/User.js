const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: Number,
  name: {type: String, required: true},
  strava_token: {type: String, required: true},
  expires_in: {type: Number, required: true},
  refresh_token: {type: String, required: true},
});

const userModel = mongoose.model('User', userSchema);

module.exports.UserSchema = userSchema;
module.exports.UserModel = userModel;
