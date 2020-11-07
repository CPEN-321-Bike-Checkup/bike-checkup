//const { ObjectID } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const url = "mongodb://localhost:27017/bikeCheckupDb";


const app = express();
const port = 5000;

app.use(express.json());
app.listen(port, () => {
    console.log('Dir: ' + __dirname + ', Server is running on port: ' + port);
});


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});
let db = mongoose.connection;
//check connection
db.once('open', function() {
    console.log('Connected to MongoDB - bikeCheckupDb');
});
//check DB errors, print if any
db.on('error', function(err) {
    console.log(err);
});




const initMaintenanceTaskRoutes = require('./routes/MaintenanceTaskRoutes');
const initUserRoutes = require('./routes/UserRoutes');
initUserRoutes(app);
initMaintenanceTaskRoutes(app);

app.get('/stravaRedirect', function(req, res, next,){
	console.log('Strava Auth Hit');
	res.send('OK');
});