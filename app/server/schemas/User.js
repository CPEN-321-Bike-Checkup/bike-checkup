const mongoose = require('mongoose');


const userSchema =  new mongoose.Schema({
    _id: Number,
    bikes: [bikeSchema], //actually stores bike objects
    label: String,
    is_retired: Boolean,
    attatchement_date: Date
});
const UserModel = mongoose.model('User', userSchema);
