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

// const taskTimeId = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');
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

  const deviceToken1 = {
    token: 'a1b2c3d4e5',
    userId: userId,
  };

  test('3. Post /registerDevice -> Register new token device', async () => {
    let response = await axios.post(
      url + '/user' + '/registerDevice/',
      deviceToken1,
    );
    expect(response.status).toBe(200);
  });

  test('4. Delete /registerDevice -> Delete token device', async () => {
    expect.assertions(1);
    let response = await axios.delete(
      url + '/user' + '/registerDevice/',
      deviceToken1,
    );
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
    const receivedBike = response.data.filter((bike) => {
      return bike._id == bikeId;
    })[0];
    // console.log(receivedBike);
    expect(response.status).toBe(200);
    expect(receivedBike._id).toBe(bikeId.toHexString());
    expect(receivedBike.owner_id).toBe(userId);
    expect(receivedBike.label).toBe(bike.label);
    expect(receivedBike.distance).toBe(bike.distance);
  });

  test('3. Get /bike -> Get bikes by userId', async () => {
    expect.assertions(5);
    let response = await axios.get(url + '/bike/' + userId);
    const receivedBike = response.data.filter((bike) => {
      return bike._id == bikeId;
    })[0];
    // console.log(receivedBike);
    expect(response.status).toBe(200);
    expect(receivedBike._id).toBe(bikeId.toHexString());
    expect(receivedBike.owner_id).toBe(userId);
    expect(receivedBike.label).toBe(bike.label);
    expect(receivedBike.distance).toBe(bike.distance);
  });

  test('4. Get /bike -> Get bikes by userId invalid ID', async () => {
    expect.assertions(1);
    try {
      await axios.get(url + '/bike/' + null);
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });
});

describe('ComponentRoute Tests', () => {
  test('1. Post / -> Creating Component', async () => {
    expect.assertions(1);
    let response = await axios.post(url + '/component' + '/', component);
    expect(response.status).toBe(201);
  });

  test('2. Get /component -> Get components by bikeId', async () => {
    expect.assertions(4);
    let response = await axios.get(url + '/component/' + bikeId);
    const receivedComponent = response.data.filter((component) => {
      return component._id == componentId;
    })[0];
    // console.log(receivedComponent);
    expect(response.status).toBe(200);
    expect(receivedComponent._id).toBe(componentId.toHexString());
    expect(receivedComponent.bike_id).toBe(bikeId.toHexString());
    expect(receivedComponent.label).toBe(component.label);
  });

  // Note: Get route handles all bad input

  test('3. Put / -> Updating Component', async () => {
    expect.assertions(1);
    let response = await axios.put(url + '/component' + '/', component);
    expect(response.status).toBe(200);
  });

  test('4. Put / -> Updating Component invalid request', async () => {
    expect.assertions(1);
    try {
      await axios.put(url + '/component/' + null);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });
});

describe('MaintenanceTaskRoute Tests', () => {
  test('1. Post / -> Creating Distance Task', async () => {
    expect.assertions(1);
    let response = await axios.post(
      url + '/maintenanceTask' + '/',
      taskDistance,
    );
    expect(response.status).toBe(201);
  });

  test('2. Post /maintenanceTask -> Creating Time Task', async () => {
    expect.assertions(1);
    let response = await axios.post(url + '/maintenanceTask' + '/', taskTime);
    expect(response.status).toBe(201);
  });

  test('3. Get /maintenanceTask -> Get tasks by userId', async () => {
    expect.assertions(5);
    let response = await axios.get(url + '/maintenanceTask?userId=' + userId);
    // console.log(response.data);
    let receivedTask = null;
    for (let taskCategory of response.data) {
      for (let task of taskCategory.data) {
        if (task.taskId == taskDistanceId) receivedTask = task;
      }
    }
    // console.log(receivedTask);
    expect(response.status).toBe(200);
    expect(receivedTask.taskId).toBe(taskDistanceId.toHexString());
    expect(receivedTask.task).toBe(taskDistance.description);
    expect(receivedTask.threshold_val).toBe(taskDistance.threshold_val);
    expect(receivedTask.repeats).toBe(taskDistance.repeats);
  });

  test('4. Get /maintenanceTask -> Get tasks by componentId', async () => {
    expect.assertions(4);
    let response = await axios.get(
      url + '/maintenanceTask?componentId=' + componentId,
    );
    // console.log(response.data);
    let receivedTask = response.data.filter((task) => {
      return task.taskId == taskDistanceId;
    })[0];
    // console.log(receivedTask);
    expect(response.status).toBe(200);
    expect(receivedTask.taskId).toBe(taskDistanceId.toHexString());
    expect(receivedTask.description).toBe(taskDistance.description);
    expect(receivedTask.repeats).toBe(taskDistance.repeats);
  });

  test('5. Put /maintenanceTask -> Updating Component', async () => {
    expect.assertions(1);
    let response = await axios.put(url + '/maintenanceTask' + '/', taskTime);
    expect(response.status).toBe(200);
  });

  test('6. Put /maintenanceTask -> Updating Component invalid request', async () => {
    expect.assertions(1);
    try {
      await axios.put(url + '/maintenanceTask/' + null);
    } catch (err) {
      expect(err.response.status).toBe(404);
    }
  });

  // TODO: shouldn't I just POST with the ID
  test('7. Post /maintenanceTask/complete -> Completing task', async () => {
    expect.assertions(1);
    let response = await axios.post(url + '/maintenanceTask/complete', [
      taskTime,
    ]);
    expect(response.status).toBe(201);
  });

  // test('6. Post /maintenanceTask -> Completing task invalid request', async () => {
  //   expect.assertions(1);
  //   try {
  //     await axios.post(url + '/maintenanceTask/complete', null);
  //   } catch (err) {
  //     expect(err.response.status).toBe(500);
  //   }
  // });
});

describe('MaintenanceRecordRoutes Tests', () => {
  test('1. Get /maintenanceRecord -> Get maintenance record by userId', async () => {
    expect.assertions(1);
    let response = await axios.get(
      url +
        '/maintenanceRecord/' +
        userId +
        '/?beforeDate=' +
        new Date() +
        '&numDays=' +
        100,
    );
    console.log(response.data);
    const receivedRecord = response.data.filter((record) => {
      return record._id == taskTimeId;
    })[0];
    // console.log(receivedComponent);
    expect(response.status).toBe(200);
    // expect(receivedRecord._id).toBe(componentId.toHexString());
  });
});

describe('Testing Resource Deletion', () => {
  test('1. Delete / -> Deleting User', async () => {
    let response = await axios.delete(url + '/user' + '/', user);
    expect(response.status).toBe(200);
  });

  test('1. Delete / -> Deleting component', async () => {
    let response = await axios.delete(url + '/component' + '/', component);
    expect(response.status).toBe(200);
  });

  test('1. Delete / -> Deleting component', async () => {
    let response = await axios.delete(url + '/maintenanceTask' + '/', taskTime);
    expect(response.status).toBe(200);
  });

  test('1. Delete / -> Deleting component', async () => {
    let response = await axios.delete(
      url + '/maintenanceTask' + '/',
      taskDistance,
    );
    expect(response.status).toBe(200);
  });
});
