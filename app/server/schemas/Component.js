const mongoose = require('mongoose');


const componentSchema = new mongoose.Schema({
    _id: Number,
    bike: {type: mongoose.Schema.Types.ObjectId, ref: 'Bike'}, //reference to Bike
    label: String,
    is_retired: Boolean,
    attatchement_date: Date
});
const ComponentModel = mongoose.model('Component', componentSchema);

