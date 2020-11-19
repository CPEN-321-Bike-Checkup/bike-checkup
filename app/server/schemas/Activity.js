const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  _id: Number,
  athlete_id: {type: mongoose.Schema.Types.Number, ref: 'User'},
  description: String,
  distance: Number,
  time_s: Number,
  date: Date,
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports.ActivitySchema = activitySchema;
module.exports.ActivityModel = activityModel;
