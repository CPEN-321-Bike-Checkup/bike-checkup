jest.mock('../../repositories/ActivityRepository');
jest.mock('../../repositories/MaintenanceTaskRepository');
jest.mock('../../repositories/MaintenanceRecordRepository');
jest.mock('../../repositories/ComponentActivityRepository');

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const initMaintenanceTaskRoutes = require('../../routes/MaintenanceTaskRoutes');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
let server;

beforeAll(() => {});

afterAll(() => {});

var url = 'http://' + ip + ':' + port + '/maintenanceTask/';
const maintSchedule1 = {
  _id: 1,
  component_id: 1,
  schedule_type: 'date',
  threshold_val: 450,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: false,
  predicted_due_date: new Date('2020-11-22'),
};

const maintSchedule3 = {
  _id: 3,
  component_id: 1,
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'brake check',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: true,
  predicted_due_date: new Date('2020-11-15'),
};

const maintSchedule3Update = {
  _id: 3,
  component_id: 1,
  schedule_type: 'distance',
  threshold_val: 120,
  description: 'brake check',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: true,
  predicted_due_date: new Date('2020-11-15'),
};

//schedule without an id
var schedModifiedNoId = JSON.parse(JSON.stringify(maintSchedule1));
delete schedModifiedNoId._id;
//schedule without an id of 0
var schedModifiedId0 = JSON.parse(JSON.stringify(maintSchedule1));
schedModifiedId0._id = 0;

describe('GetById(id) Test Cases', () => {
  test('Input with existing id', () => {
    expect.assertions(3);
    return maintenanceTaskService.GetById(1).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(1);
      expect(resp.data.description).toBe('oil chain');
    });
  });

  test('Input with nonexisting id', () => {
    expect.assertions(1);
    return maintenanceTaskService.GetById(99).then((resp) => {
      expect(code).toBe(400);
    });
  });
});

describe('Create(maintenanceTask) Test Cases', () => {
  test('Valid new maintenanceTask', () => {
    expect.assertions(3);
    return maintenanceTaskService.Create(maintSchedule3).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(1);
      expect(resp.data.description).toBe('brake check');
    });
  });
});

describe('MarkCompleted(maintenanceTask) Test Cases', () => {
  test('Valid existing repeating maintenanceTask', () => {
    expect.assertions(5);
    return maintenanceTaskService.MarkCompleted(maintSchedule3).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(2);
      expect(resp.data.taskResult.n).toBe(1);
      expect(resp.data.taskResult.nModified).toBe(1);
      expect(resp.data.createRecordResult.description).toBe('brake check');
    });
  });

  test('Valid existing non-repeating maintenanceTask', () => {
    expect.assertions(4);
    return maintenanceTaskService.MarkCompleted(maintSchedule1).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(2);
      expect(resp.data.taskResult).toBe(true);
      expect(resp.data.createRecordResult.description).toBe('oil chain');
    });
  });
});

describe('Update(maintenanceTask) Test Cases', () => {
  test('Update existing maintainenceTask with new changes', () => {
    expect.assertions(4);
    return maintenanceTaskService.Update(maintSchedule3Update).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(1);
      expect(resp.data.n).toBe(1);
      expect(resp.data.nModified).toBe(1);
    });
  });

  test('Update existing maintainenceTask with no changes', () => {
    expect.assertions(4);
    return maintenanceTaskService.Update(maintSchedule3).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data.length).toBe(1);
      expect(resp.data.n).toBe(1);
      expect(resp.data.nModified).toBe(0);
    });
  });
});

describe('Delete(maintenanceTask) Test Cases', () => {
  test('Delete existing maintainenceTask', () => {
    expect.assertions(2);
    return maintenanceTaskService.Delete(maintSchedule3).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data).toBe(true);
    });
  });

  test('Delete non-existing maintainenceTask', () => {
    expect.assertions(2);
    return maintenanceTaskService.Delete(maintSchedule3Update).then((resp) => {
      expect(code).toBe(200);
      expect(resp.data).toBe(false);
    });
  });
});

describe('MaintenanceRecordFromTask(maintenanceTask) Test Cases', () => {
  test('Make record from existing maintainenceTask', () => {
    expect.assertions(3);
    return maintenanceTaskService
      .MaintenanceRecordFromTask(maintSchedule3)
      .then((resp) => {
        expect(resp.data.description).toBe('brake check');
        expect(resp.data.component_id).toBe(1);
        expect(resp.data.maintenance_date).toBe(new Date('2020-10-08'));
      });
  });
});

describe('GetTaskScheduleForUser(userId) Test Cases', () => {
  test('Get tasks for user - Update mock data dates', () => {
    expect.assertions(8);
    let schedule = maintenanceTaskService.GetTaskScheduleForUser(1);
    expect(schedule[0].title).toBe('Overdue');
    expect(schedule[0].data.description).toBe('oil chain'); //maintSchedule1
    expect(schedule[1].title).toBe('Today');
    expect(schedule[1].data.length).toBe(0);
    expect(schedule[2].title).toBe('Next 7 Days');
    expect(schedule[2].data.description).toBe('tire check'); //maintSchedule2
    expect(schedule[3].title).toBe('Upcoming');
    expect(schedule[3].data.description).toBe('brake check'); //maintSchedule3
  });
});

describe('GetScheduledTasksSorted(userId, numDays) Test Cases', () => {
  test('Get and sort tasks in date range, numDays = 0', () => {
    expect.assertions(4);
    let sortedList = maintenanceTaskService.GetScheduledTasksSorted(1);
    expect(sortedList.length).toBe(3);
    expect(sortedList[0].description).toBe('oil chain'); //maintSchedule1
    expect(sortedList[1].description).toBe('tire check'); //maintSchedule2
    expect(sortedList[2].description).toBe('brake check'); //maintSchedule3
  });

  test('Get and sort tasks in date range, numDays = 30', () => {
    expect.assertions(3);
    let sortedList = maintenanceTaskService.GetScheduledTasksSorted(1, 30);
    expect(sortedList.length).toBe(2);
    expect(sortedList[0].description).toBe('oil chain'); //maintSchedule1
    expect(sortedList[1].description).toBe('tire check'); //maintSchedule2
  });
});

//TODO: addDays test cases

describe('GetTasksForComponent(componentId) Test Cases', () => {
  test('Get task with valid componentId', () => {
    expect.assertions(1);
    let tasks = maintenanceTaskService.GetTasksForComponent(3);
    expect(tasks.description).toBe('tire check');
  });
});

/*describe('500 Resp Tests', async () => {
  test('Get tasks for user 200 OK', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?userId=1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data.length).toBe(3);
    });
  });

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

describe('20X Resp Tests', () => {
  test('Get tasks for user 200 OK', () => {
    expect.assertions(1);
    return axios.get(url + 'prediction?userId=1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data.length).toBe(3);
    });
  });

  test('Get task 200 OK', () => {
    expect.assertions(1);
    return axios.get(url + '1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data._id).toBe(1);
    });
  });

  test('Create task 201 OK', () => {
    expect.assertions(1);
    return axios.post(url, maintSchedule1).then((resp) => {
      var code = resp.status;
      expect(code).toBe(201);
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
});*/
