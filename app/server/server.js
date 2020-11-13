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
const initStravaRoutes = require('./routes/StravaRoutes');
const initMaintenanceRecordRoutes = require('./routes/MaintenanceRecordRoutes');

initUserRoutes(app);
initStravaRoutes(app);
initMaintenanceTaskRoutes(app);
initMaintenanceRecordRoutes(app);

app.get('/stravaRedirect', function (req, res, next) {
  console.log('Strava Auth Hit');
  res.send('OK');
});

let createTestData = async function (userId) {
  const userRepository = require('./repositories/UserRepository');

  let record = {
    description: 'Oil chain',
    maintenance_date: new Date(),
  };

  let record2 = {
    description: 'Replace chain',
    maintenance_date: new Date(),
  };

  let component1 = {
    label: 'KMC X11EL-1 Chain',
    attatchment_date: new Date(),
    removal_date: new Date(),
    maintenance_records: [record, record2],
    predicted_maintenance_date: new Date(),
  };

  let record3 = {
    description: 'Bleed brakes',
    maintenance_date: new Date(),
  };

  let component2 = {
    label: 'Shimano 105 Hydraulic Disc, 160mm',
    attatchment_date: new Date(),
    removal_date: new Date(),
    maintenance_records: [record3],
    predicted_maintenance_date: new Date(),
  };

  // let bike = {
  //   id: 25,
  //   label: 'Norco Sasquatch',
  //   components: [component],
  // };

  let bike1 = {
    _id: 'b8294806',
    owner: userId,
    label: "Rachel's Hybrid Bike",
    components: [component1],
    __v: 0,
  };
  let bike2 = {
    _id: 'b8294804',
    owner: userId,
    label: "Rachel's Road Bike",
    components: [component2],
    __v: 0,
  };

  let user = {
    _id: userId,
    name: 'Rachel Smith',
    strava_token: '348672a87ebc0e4444b4a81961b32fdd75a761fc',
    refresh_token: '2868f45d72e20be5fa737eb69ba1dc618dcbb495',
    expires_in: 17932,
    bikes: [bike1, bike2],
    deviceTokens: [],
    __v: 0,
  };

  userRepository.Create(user);
};

const userId = 123;
// createTestData(userId);
