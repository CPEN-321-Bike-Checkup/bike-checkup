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
  server = app.listen(port, () => {
    initUserRoutes(app);
    initMaintenanceTaskRoutes(app);
    initBikeRoutes(app);
    initComponentRoutes(app);

    //setup database data
    axios.post(url + '/user', user);
    axios.post(url + '/maintenanceTask', maintSchedule1);
    axios.post(url + '/maintenanceTask', maintSchedule2);
    axios.post(url + '/bike', bike1);
    axios.post(url + '/component', component1);
    axios.post(url + '/component', component2);
    axios.post(url + '/maintenanceRecord', maintRecord1);
  });
});

afterAll(() => {
  server.close();
});

var maintSchedule1 = {
  _id: 400,
  component_id: 301,
  schedule_type: 'date',
  threshold_val: 450,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: false,
  predicted_due_date: new Date('2020-11-22'),
};

var maintSchedule1_update = {
  _id: 400,
  component_id: 301,
  schedule_type: 'date',
  threshold_val: 600,
  description: 'get chains oiled updated',
  last_maintenance_val: new Date('2020-10-15'),
  repeats: false,
  predicted_due_date: new Date('2020-11-25'),
};

var maintSchedule2 = {
  _id: 401,
  component_id: 302,
  schedule_type: 'distance',
  threshold_val: 450,
  description: 'bleed brakes',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: false,
  predicted_due_date: new Date('2020-11-29'),
};

var maintSchedule3 = {
  _id: 402,
  component_id: 302,
  schedule_type: 'distance',
  threshold_val: 1500,
  description: 'check brakes',
  last_maintenance_val: new Date('2020-09-23'),
  repeats: false,
  predicted_due_date: new Date('2020-12-03'),
};

var maintSchedule_error1 = {
  _id: 401,
  component_id: 302,
  schedule_type: 'distance',
  threshold_val: -2,
  description: 'bleed brakes',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: false,
  predicted_due_date: new Date('2020-11-29'),
};

var maintRecord1 = {
  _id: 601,
  description: 'bled brakes',
  component_id: 301,
  maintenance_date: new Date('2020-11-01'),
  replacement_comp_id: 311,
};

var user = {
  _id: 3,
  bikes: [],
  name: 'Tim Sampleton',
  deviceTokens: [],
  strava_token: 'asdfoiuasfnloa',
  expires_in: '4938570',
  refresh_token: 'fesojdkvhnfmcasod',
  activity_cache_date: new Date(),
};

var bike1 = {
  _id: 201,
  owner: 3,
  label: 'mountain bike',
  components: [],
  distance: 500,
};

var component1 = {
  _id: 301,
  bike: 2,
  label: 'brakes',
  attachment_date: new Date('2020-10-11'),
  removal_date: new Date('2020-12-20'),
  maintenance_tasks: [],
  maintenance_records: [],
  activities: [],
  predicted_maintenance_date: new Date('2020-11-15'),
};

var component2 = {
  _id: 302,
  bike: 2,
  label: 'chains',
  attachment_date: new Date('2020-09-01'),
  removal_date: new Date('2021-02-15'),
  maintenance_tasks: [],
  maintenance_records: [],
  activities: [],
  predicted_maintenance_date: new Date('2020-12-15'),
};

//user without an id
var userModifiedNoId = JSON.parse(JSON.stringify(user));
delete userModifiedNoId._id;
//user id of 0
var userModifiedId0 = JSON.parse(JSON.stringify(user));
userModifiedId0._id = 0;

var device = {
  token: 'asonhcfoisjuheoqihbnfcxsaoid',
  ownerId: '3',
};
//device without an token
var deviceModifiedNoId = JSON.parse(JSON.stringify(device));
delete deviceModifiedNoId.token;
//token of 0
var deviceModifiedId0 = JSON.parse(JSON.stringify(device));
deviceModifiedId0.token = 0;
//owner of 0
var deviceModifiedOwnerId0 = JSON.parse(JSON.stringify(device));
deviceModifiedOwnerId0.ownerId = 0;

describe('User requests their schedule Tests', () => {
  test('Get schedule tasks 200 Ok', async () => {
    expect.assertions(2);
    /*var result = await axios.get(url + '/maintenanceTask' + '/?userId=3');
    var code = result.status;
    expect(code).toBe(200);
    expect(result.data).toBe([maintSchedule1, maintSchedul2]);*/

    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([maintSchedule1, maintSchedul2]);
    });
  });
  //failing cases
  /*test('Get schedule tasks 500 Error', () => {
    expect.assertions(1);
    axios.get(url + '/maintenanceTask' + '/').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
      done();
    });
  });
*/
});

describe('User requests their bikes Tests', () => {
  test('Get bikes 200 Ok', async () => {
    expect.assertions(2);
    await axios.get(url + '/bike' + '/3' + '/bikes').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([bike1]);
    });
  });
});

describe('User requests a bikes components Tests', () => {
  test('Get bikes components 200 Ok', async () => {
    expect.assertions(2);
    await axios.get(url + '/component' + '/201').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([component1, component2]);
    });
  });
});

describe('User requests scheduled maintenance tasks for a component Tests', () => {
  test('Get scheduled maint tasks 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .get(url + '/maintenanceTask' + '/component' + '/301')
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
        expect(resp.data).toBe([maintSchedule1]);
      });
  });
});

//The latter tasks will depend on the prior tasks to pass
//TODO: #4 of expected behaviour
describe('User adds/updates a new maintenance item for a component Tests', () => {
  test('1. Create maint task that already exists 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .post(url + '/maintenanceTask' + '/', maintSchedule1_update)
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(500); //TODO: No item created, which status code?
      });

    //maint schedule 1 should be updated
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([maintSchedule1_update, maintSchedul2]);
    });
  });

  test('2. Update maint task that already exists 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .put(url + '/maintenanceTask' + '/', maintSchedule1_update)
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
      });

    //maint schedule 1 should be updated
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([maintSchedule1_update, maintSchedul2]);
    });
  });

  test('3. Create maint task that does not exists 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .post(url + '/maintenanceTask' + '/', maintSchedule3)
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(201);
      });

    //maint schedule 3 should be added
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([
        maintSchedule1_update,
        maintSchedul2,
        maintSchedule3,
      ]);
    });
  });

  test('4. Create maint task with invalid threshold 400 Error', async () => {
    expect.assertions(2);
    await axios
      .post(url + '/maintenanceTask' + '/', maintSchedule_error1)
      .catch((err) => {
        var code = err.status;
        expect(code).toBe(400);
      });

    //maint task should not have been added
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data).toBe([
        maintSchedule1_update,
        maintSchedul2,
        maintSchedule3,
      ]);
    });
  });

  test('5. Update maint task with invalid threshold 400 Error', async () => {
    expect.assertions(2);
    await axios
      .put(url + '/maintenanceTask' + '/', maintSchedule_error1)
      .catch((err) => {
        var code = err.status;
        expect(code).toBe(500);
      });

    //maint task should not have been added
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(400);
      expect(resp.data).toBe([
        maintSchedule1_update,
        maintSchedul2,
        maintSchedule3,
      ]);
    });
  });
});

describe('User deletes a maintenance item Tests', () => {
  test('delete maint task 200 Ok', async () => {
    expect.assertions(3);
    await axios
      .delete(url + '/maintenanceTask' + '/', maintSchedule3)
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
      });

    //task should have been deleted
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(400);
      expect(resp.data).toBe([maintSchedule1_update, maintSchedul2]);
    });
  });
});

//TODO: fill out expected return data
describe('User requests their Strava activities Tests', () => {
  test('get activities belonging to user 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .get(url + '/strava' + '/3' + '/connectedStrava')
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
        expect(resp.data).toBe([]);
      });
  });
});

describe('User requests their maintenance history Tests', () => {
  test('get activities belonging to user 200 Ok', async () => {
    expect.assertions(2);
    await axios
      .get(url + '/maintenanceRecord' + '/3' + '/days' + '/50')
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
        expect(resp.data).toBe([maintRecord1]);
      });
  });
});

describe('User completes a scheduled maintenance task Tests', () => {
  test('complete a scheduled task 201 Ok', async () => {
    expect.assertions(2);
    await axios
      .post(url + '/maintenanceTask' + '/complete', maintSchedule2)
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(201);
      });

    //maintSchedule2 is removed from maint task list for user
    await axios.get(url + '/maintenanceTask' + '/?userId=3').catch((resp) => {
      var code = resp.status;
      expect(code).toBe(400);
      expect(resp.data).toBe([maintSchedule1_update]);
    });

    //maintSchedule2 is added to maint record list
    //TODO: fill out expected return data
    await axios
      .get(url + '/maintenanceRecord' + '/3' + '/days' + '/50')
      .catch((resp) => {
        var code = resp.status;
        expect(code).toBe(200);
        expect(resp.data).toBe([maintRecord1]);
      });
  });
});
