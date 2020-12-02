const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
let server;
const initUserRoutes = require('../../routes/UserRoutes');
const initMaintenanceTaskRoutes = require('../../routes/MaintenanceTaskRoutes');
const initBikeRoutes = require('../../routes/BikeRoutes');
const initComponentRoutes = require('../../routes/ComponentRoutes');

var url = 'http://' + ip + ':' + port;
beforeAll(() => {
  initUserRoutes(app);
  initMaintenanceTaskRoutes(app);
  initBikeRoutes(app);
  initComponentRoutes(app);
});

var maintSchedule1 = {
  //_id: 400,
  component_id: '5fc729e954b31d9fc41dd6e0',
  schedule_type: 'date',
  threshold_val: 30,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: true,
  predicted_due_date: new Date('2020-11-11'),
};

var maintSchedule1_update = {
  //_id: 400,
  component_id: 301,
  schedule_type: 'date',
  threshold_val: 600,
  description: 'get chains oiled updated',
  last_maintenance_val: new Date('2020-10-15'),
  repeats: false,
  predicted_due_date: new Date('2020-11-25'),
};

var maintSchedule2 = {
  //_id: 401,
  component_id: '5fc729e954b31d9fc41dd6e0',
  schedule_type: 'distance',
  threshold_val: 450,
  description: 'bleed brakes',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: false,
  predicted_due_date: new Date('2020-11-29'),
};

var maintSchedule3 = {
  //_id: 402,
  component_id: 302,
  schedule_type: 'distance',
  threshold_val: 1500,
  description: 'check brakes',
  last_maintenance_val: new Date('2020-09-23'),
  repeats: false,
  predicted_due_date: new Date('2020-12-03'),
};

var maintSchedule_error1 = {
  //_id: 401,
  component_id: 302,
  schedule_type: 'distance',
  threshold_val: -2,
  description: 'bleed brakes',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: false,
  predicted_due_date: new Date('2020-11-29'),
};

var maintRecord1 = {
  //_id: 601,
  description: 'bled brakes',
  component_id: 301,
  maintenance_date: new Date('2020-11-01'),
  replacement_comp_id: 311,
};

var user = {
  _id: 4,
  name: 'Tim Sampleton',
  strava_token: 'asdfoiuasfnloa',
  expires_in: '4938570',
  refresh_token: 'fesojdkvhnfmcasod',
};

var bike1 = {
  //_id: 201,
  owner: 3,
  label: 'mountain bike',
  //components: [301, 302],
  distance: 500,
};

var component1 = {
  //_id: 5fc729e954b31d9fc41dd6e0
  bike_id: 201,
  label: 'brakes',
  attachment_date: new Date('2020-10-11'),
  removal_date: undefined,
};

var component2 = {
  //_id: 5fc729e954b31d9fc41dd6e1,
  bike: 201,
  label: 'chains',
  attachment_date: new Date('2020-09-01'),
  removal_date: undefined,
};

const activity1 = {
  //_id: 1,
  description: 'test',
  distance: 50,
  time_s: 360,
  date: new Date('2020-10-21'),
  components: [1],
};

describe('UserRoutes Tests', () => {
  test('1. Post / -> Creating User', async () => {
    expect.assertions(3);
    let response = await axios.post(url + '/user' + '/', user);
    //expect(response).toBe();  //DEBUG to see response
    expect(response.data._id).toBe(4);
    expect(response.data.name).toBe('Tim Sampleton');
    expect(response.status).toBe(200);
  });

  test('2. Get /:userId -> Get by userId', async () => {
    expect.assertions(3);
    let response = await axios.get(url + '/user/4');
    expect(response.data[0]._id).toBe(4);
    expect(response.data[0].name).toBe('Tim Sampleton');
    expect(response.status).toBe(200);
  });

  test('3. Delete / -> Deleting User', async () => {
    expect.assertions(1);
    let response = await axios.delete(url + '/user' + '/', user);
    expect(response.status).toBe(200);
  });
});
