//const { ObjectID } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/bikeCheckupDb';


const app = express();
const port = 5000;

app.use(express.json());
app.listen(port, () => {
	console.log('Dir: ' + __dirname + ', Server is running on port: ' + port);
});


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
//check connection
db.once('open', function () {
	console.log('Connected to MongoDB - bikeCheckupDb');
});
//check DB errors, print if any
db.on('error', function (err) {
	console.log(err);
});




const initMaintenanceScheduleRoutes = require('./routes/MaintenanceScheduleRoutes');
const initUserRoutes = require('./routes/UserRoutes');
initUserRoutes(app);
initMaintenanceScheduleRoutes(app);

app.get('/stravaRedirect', function (req, res, next,) {
	console.log('Strava Auth Hit');
	res.send('OK');
});



var token = 'ckiJogkPRKyHyelqr-LKJf:APA91bEwN1Kvl-lx5YtIvT2k18P5JcUCbT9U1u99mr4qdW9qA5l48K3-4AUpI898aKU5kZaCFPS941wWFEBjr0eVBAvr23JUzUlUzQle1slfLxF9zhe1gRjHB1E0pmePRcIhdfbURg9r';
let notificationService = require('./services/NotificationService');

app.post('/notification', function (req, res, next) {
	var message = notificationService.CreateMessage('Test Notification Name', 'Test Notification', 'This is a notification', {}, token);
	notificationService.SendNotification(message);

	res.send('notification sent');
});