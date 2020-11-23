const mongoose = require('mongoose');

const componentActivitySchema = new mongoose.Schema({
  component_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true,
  },
  activity_id: {
    type: mongoose.Schema.Types.Number,
    ref: 'Activity',
    required: true,
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
