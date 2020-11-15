jest.mock('../../repositories/ActivityRepository');
jest.mock('../../repositories/MaintenanceTaskRepository');
jest.mock('../../repositories/MaintenanceRecordRepository');

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const initMaintenanceTaskRoutes = require('../../routes/MaintenanceTaskRoutes');
let server;

beforeAll(() => {
  server = app.listen(port, () => {
    initMaintenanceTaskRoutes(app);
  });
});

afterAll(() => {
  server.close();
});

var url = 'http://' + ip + ':' + port + '/maintenanceTask/';
var maintSchedule1 = {
  _id: 400,
  component_id: 1,
  schedule_type: 'date',
  threshold_val: 450,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: false,
  predicted_due_date: new Date('2020-11-22'),
};
//schedule without an id
var schedModifiedNoId = JSON.parse(JSON.stringify(maintSchedule1));
delete schedModifiedNoId._id;
//schedule without an id of 0
var schedModifiedId0 = JSON.parse(JSON.stringify(maintSchedule1));
schedModifiedId0._id = 0;

describe('500 Resp Tests', async () => {
  test('Get tasks for user 500 Error', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?userId=20').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Get task 500 Error', () => {
    expect.assertions(1);
    return axios.get(url + '20').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Create task 500 Error', () => {
    expect.assertions(1);
    return axios.post(url, maintSchedule1).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Mark task done 500 Error', () => {
    expect.assertions(1);
    return axios.post(url + 'complete', maintSchedule1).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Update task 500 Error', () => {
    expect.assertions(1);
    return axios.put(url, maintSchedule1).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Delete task 500 Error', () => {
    expect.assertions(1);
    return axios.delete(url, maintSchedule1).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });
});

describe('200 Resp Tests', () => {
  test('Get tasks for user 200 OK', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?userId=1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Get task 200 OK', () => {
    expect.assertions(1);
    return axios.get(url + '1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Create task 200 OK', () => {
    expect.assertions(1);
    return axios.post(url, maintSchedule1).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Mark task done 200 OK', () => {
    expect.assertions(1);
    return axios.post(url + 'complete', maintSchedule1).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Update task 200 OK', () => {
    expect.assertions(1);
    return axios.put(url, maintSchedule1).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Delete task 200 OK', () => {
    expect.assertions(1);
    return axios.delete(url, maintSchedule1).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });
});

describe('400 Resp Tests', () => {
  test('Get tasks for user 400 Error', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?user=1').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });

  test('Create task 400 Error', () => {
    expect.assertions(1);
    return axios.post(url, schedModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });

  test('Mark task done 400 Error', () => {
    expect.assertions(1);
    return axios.post(url + 'complete', schedModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });

  test('Update task 400 Error', () => {
    expect.assertions(1);
    return axios.put(url, schedModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });

  test('Delete task 400 Error', () => {
    expect.assertions(1);
    return axios.delete(url, maintSchedule1).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('404 Resp Tests', () => {
  test('Get tasks for user 404 Error', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?user=0').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Create task 404 Error', () => {
    expect.assertions(1);
    return axios.post(url, schedModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Mark task done 404 Error', () => {
    expect.assertions(1);
    return axios.post(url + 'complete', schedModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Update task 404 Error', () => {
    expect.assertions(1);
    return axios.put(url, schedModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Delete task 404 Error', () => {
    expect.assertions(1);
    return axios.delete(url, schedModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });
});
