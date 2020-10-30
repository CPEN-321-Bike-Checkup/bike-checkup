const mongoose = require('mongoose');

const componentActivitySchema = new mongoose.Schema({
  component_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Component'
  },
  activity_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Activity'
  }
});
const componentActivityModel = mongoose.model('ComponentActivity', componentActivitySchema);

module.exports.ComponentActivityModel = componentActivityModel;
module.exports.ComponentActivitySchema = componentActivitySchema;