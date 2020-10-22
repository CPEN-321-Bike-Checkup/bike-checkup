const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  _id: Number,
  distance: Number,
  date: Date
});

const Activity = mongoose.model('Activity', activitySchema);