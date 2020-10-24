const mongoose = require('mongoose');
const bikeSchema = require('./Bike').BikeSchema;


const userSchema =  new mongoose.Schema({
    _id: Number,
    bikes: [bikeSchema], //actually stores bike objects
    strava_token: String,
    name: String
});
const UserModel = mongoose.model('User', userSchema);

module.exports.UserModel = UserModel;
module.exports.UserSchema = userSchema;