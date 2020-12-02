const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
let server;
const initUserRoutes = require('../../routes/UserRoutes');
const initMaintenanceTaskRoutes = require('../../routes/MaintenanceTaskRoutes');
const initBikeRoutes = require('../../routes/BikeRoutes');
const initComponentRoutes = require('../../routes/ComponentRoutes');

const ip = '192.168.1.83';
const port = 5000;

var url = 'http://' + ip + ':' + port;
beforeAll(() => {
  // server = app.listen(port, () => {
  initUserRoutes(app);
  initMaintenanceTaskRoutes(app);
  initBikeRoutes(app);
  initComponentRoutes(app);

  //setup database data
  // axios.post(url + '/user', user).catch(
  //   // (response) => console.log(response),
  //   (err) => console.log(err),
  // );
  // axios.post(url + '/bike', bike).catch(
  //   // (response) => console.log(response),
  //   (err) => console.log(err),
  // );
  // axios.post(url + '/component', component).catch(
  //   // (response) => console.log(response),
  //   (err) => console.log(err),
  // );
  // axios.post(url + '/maintenanceTask', taskTime).catch(
  //   // (response) => console.log(response),
  //   (err) => console.log(err),
  // );
  // axios.post(url + '/maintenanceTask', taskDistance).catch(
  //   // (response) => console.log(response),
  //   (err) => console.log(err),
  // );
  // });
});

afterAll(() => {
  // server.close();
});

/*** TEST DATA ***/
const userId = Math.floor(Math.random() * 100000000);
const user = {
  _id: userId,
  name: 'Tim Sampleton',
  strava_token: 'b903fbbecdb0fe228feb7695e06dbef457ebdc6c',
  refresh_token: '2868f45d72e20be5fa737eb69ba1dc618dcbb495',
  expires_in: 13241,
};

const bikeId = mongoose.Types.ObjectId();

const bike = {
  _id: bikeId,
  owner_id: userId,
  label: "Tim Sampleton's Bike",
  distance: 438846,
};

const componentId = mongoose.Types.ObjectId();

const component = {
  // _id: 'c123456789abcdefghijklmn',
  _id: componentId,
  bike_id: bikeId,
  label: 'Chain: CN900',
  attachment_date: new Date('2020-12-02T04:34:39.940Z'),
};

const taskTimeId = mongoose.Types.ObjectId();

const taskTime = {
  // _id: 't123456789abcdefghi-time',
  _id: taskTimeId,
  component_id: componentId,
  description: 'Oil Chain',
  schedule_type: 'date',
  threshold_val: 5,
  repeats: true,
  // last_maintenance_val: {$date: '2020-12-02T04:35:28.379Z'},
};

const taskDistanceId = mongoose.Types.ObjectId();

const taskDistance = {
  // _id: 't123456789abcde-distance',
  _id: taskDistanceId,
  component_id: componentId,
  description: 'Replace Chain',
  schedule_type: 'distance',
  threshold_val: 5,
  repeats: false,
  // last_maintenance_val: {$date: '2020-12-02T04:36:08.505Z'},
};

describe('UserRoutes Tests', () => {
  test('1. Post / -> Creating User', async () => {
    expect.assertions(3);
    let response = await axios.post(url + '/user' + '/', user);
    //expect(response).toBe();  //DEBUG to see response
    expect(response.data._id).toBe(userId);
    expect(response.data.name).toBe(user.name);
    expect(response.status).toBe(200);
  });

  test('2. Get /:userId -> Get by userId', async () => {
    expect.assertions(3);
    let response = await axios.get(url + '/user/' + userId);
    expect(response.data[0]._id).toBe(userId);
    expect(response.data[0].name).toBe(user.name);
    expect(response.status).toBe(200);
  });

  test('3. Delete / -> Deleting User', async () => {
    expect.assertions(1);
    let response = await axios.delete(url + '/user' + '/', user);
    expect(response.status).toBe(200);
  });
});

describe('BikeRoute Tests', () => {
  test('1. Post / -> Creating Bike', async () => {
    expect.assertions(1);
    let response = await axios.post(url + '/bike' + '/', bike);
    expect(response.status).toBe(201);
  });

  test('2. Get /bike -> Get bikes', async () => {
    expect.assertions(5);
    let response = await axios.get(url + '/bike/');
    const bike = response.data.filter((bike) => {
      return bike._id == bikeId;
    })[0];
    console.log(bike)
    expect(response.status).toBe(200);
    expect(bike._id).toBe(bikeId.toHexString());
    expect(bike.owner_id).toBe(userId);
    expect(bike.label).toBe(bike.label);
    expect(bike.distance).toBe(bike.distance);
  });
});

// describe('User requests their bikes Tests', () => {
//   test('1. Get bikes 200 Ok', async () => {
//     expect.assertions(2);
//     let response = await axios.get(url + '/bike' + '/3');
//     expect(response).toBe(); //DEBUG check return val
//     expect(response.status).toBe(200);
//   });
// });

// describe('User requests a bikes components Tests', () => {
//   test('1. Get bikes components 200 Ok', async () => {
//     expect.assertions(2);
//     let response = await axios.get(url + '/component' + '/201');
//     expect(response).toBe(); //DEBUG check return val
//     expect(response.status).toBe(200);
//   });
// });

// //user without an id
// var userModifiedNoId = JSON.parse(JSON.stringify(user));
// delete userModifiedNoId._id;
// //user id of 0
// var userModifiedId0 = JSON.parse(JSON.stringify(user));
// userModifiedId0._id = 0;

// var device = {
//   token: 'asonhcfoisjuheoqihbnfcxsaoid',
//   ownerId: '3',
// };
// //device without an token
// var deviceModifiedNoId = JSON.parse(JSON.stringify(device));
// delete deviceModifiedNoId.token;
// //token of 0
// var deviceModifiedId0 = JSON.parse(JSON.stringify(device));
// deviceModifiedId0.token = 0;
// //owner of 0
// var deviceModifiedOwnerId0 = JSON.parse(JSON.stringify(device));
// deviceModifiedOwnerId0.ownerId = 0;

// describe('User requests their schedule Tests', () => {
//   test('1. Get schedule tasks 200 Ok', async () => {
//     expect.assertions(2);
//     let response = await axios.get(url + '/maintenanceTask' + '/?userId=1');
//     expect(response).toBe(); //DEBUG check return val
//     expect(response.status).toBe(200);
//   });
// });

// describe('User requests their bikes Tests', () => {
//   test('1. Get bikes 200 Ok', async () => {
//     expect.assertions(2);
//     let response = await axios.get(url + '/bike' + '/3');
//     expect(response).toBe(); //DEBUG check return val
//     expect(response.status).toBe(200);
//   });
// });

// describe('User requests a bikes components Tests', () => {
//   test('1. Get bikes components 200 Ok', async () => {
//     expect.assertions(2);
//     let response = await axios.get(url + '/component' + '/201');
//     expect(response).toBe(); //DEBUG check return val
//     expect(response.status).toBe(200);
//   });
// });

/*describe('User requests scheduled maintenance tasks for a component Tests', () => {
  test('1. Get scheduled maint tasks 200 Ok', async () => {
    expect.assertions(2);
    let response = await axios.get(
      url + '/maintenanceTask' + '?componentId=301&userId=3',
    );
    expect(response).toBe(); //DEBUG check return val
    expect(response.status).toBe(200);
  });

  test('3. Delete / -> Deleting User', async () => {
    expect.assertions(1);
    let response = await axios.delete(url + '/user' + '/', user);
    expect(response.status).toBe(200);
  });
});*/
