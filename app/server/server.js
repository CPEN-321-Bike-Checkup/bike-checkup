const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/bikeCheckupDb';
const axios = require('axios');

const app = express();
const port = 5000;

app.use(express.json());
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
//check connection
db.once('open', function () {
  console.log('Connected to MongoDB - bikeCheckupDb');
});
//check DB errors, print if any
db.on('error', function (err) {
  console.log(err);
});

app.get('/stravaActivities', async function (req, res, next) {
  var token = '07dad63ccaf2f16c846ca5a30c6128e27cd82338';
  axios
    .get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {Authorization: 'Bearer '.concat(token)},
    })
    .then((resp) => {
      console.log(resp.data);
      res.send(resp.data);
    })
    .catch((err) => {
      console.error(err);
    });
});

const initMaintenanceTaskRoutes = require('./routes/MaintenanceTaskRoutes');
const initUserRoutes = require('./routes/UserRoutes');
initUserRoutes(app);
initMaintenanceTaskRoutes(app);

app.get('/stravaRedirect', function (req, res, next) {
  console.log('Strava Auth Hit');
  res.send('OK');
});
