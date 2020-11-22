const mongoose = require('mongoose');

const componentActivitySchema = new mongoose.Schema({
  _id: false,
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
  },
  activity_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Activity',
  },
});
componentActivitySchema.index(
  {component_id: 1, activity_id: 1},
  {unique: true},
);

const componentActivityModel = mongoose.model(
  'ComponentActivity',
  componentActivitySchema,
);

module.exports.ComponentActivityModel = componentActivityModel;
module.exports.ComponentActivitySchema = componentActivitySchema;
