const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  _id: Number,
  distance: Number,
  date: Date,
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports.ActivitySchema = activitySchema;
module.exports.ActivityModel = activityModel;
