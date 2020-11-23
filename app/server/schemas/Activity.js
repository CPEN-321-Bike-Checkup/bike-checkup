const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  _id: {type: Number, required: true},
  athlete_id: {type: mongoose.Schema.Types.Number, ref: 'User'},
  description: String,
  distance: {type: Number, required: true},
  time_s: Number,
  date: {type: Date, required: true},
});

const activityModel = mongoose.model('Activity', activitySchema);

module.exports.ActivitySchema = activitySchema;
module.exports.ActivityModel = activityModel;
