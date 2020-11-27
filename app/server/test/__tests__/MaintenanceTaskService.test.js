jest.mock('../../repositories/ActivityRepository');
jest.mock('../../repositories/MaintenanceTaskRepository');
jest.mock('../../repositories/MaintenanceRecordRepository');
jest.mock('../../repositories/ComponentActivityRepository');

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const initMaintenanceTaskRoutes = require('../../routes/MaintenanceTaskRoutes');
const maintenanceTaskService = require('../../services/MaintenanceTaskService');
let server;

beforeAll(() => {});

afterAll(() => {});

var url = 'http://' + ip + ':' + port + '/maintenanceTask/';
const maintSchedule1 = {
  _id: 1,
  component_id: 1,
  schedule_type: 'date',
  threshold_val: 30,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: true,
  predicted_due_date: new Date('2020-11-10'),
};

const maintSchedule2 = {
  _id: 2,
  component_id: 3,
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'tire check',
  last_maintenance_val: new Date('2020-10-10'),
  repeats: false,
  predicted_due_date: new Date('2020-12-01'),
};

const maintSchedule3 = {
  _id: 3,
  component_id: 1,
  schedule_type: 'distance',
  threshold_val: 200,
  description: 'brake check',
  last_maintenance_val: new Date('2020-09-26'),
  repeats: true,
  predicted_due_date: new Date('2021-03-20'),
};

var schedule_data = [maintSchedule1, maintSchedule2, maintSchedule3];

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

const maintSchedule4 = {
  _id: 4,
  component_id: 1,
  schedule_type: 'distance',
  threshold_val: 500,
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
  test('Input with existing id', async () => {
    expect.assertions(4);
    let response = await maintenanceTaskService.GetById(1);
    expect(response._id).toBe(1);
    expect(response.description).toBe('oil chain');
    expect(response.repeats).toBe(true);
    expect(response.threshold_val).toBe(450);
  });
});

describe('Create(maintenanceTask) Test Cases', () => {
  test('Valid new maintenanceTask', async () => {
    expect.assertions(4);
    let response = await maintenanceTaskService.Create(maintSchedule4);
    expect(response._id).toBe(4);
    expect(response.description).toBe('brake check');
    expect(response.repeats).toBe(true);
    expect(response.threshold_val).toBe(500);
  });
});

describe('MarkCompleted(maintenanceTask) Test Cases', () => {
  test('Valid existing repeating maintenanceTask', async () => {
    expect.assertions(4);
    let response = await maintenanceTaskService.MarkCompleted([maintSchedule1]);
    expect(response).toBe(1);
    expect(response[0].n).toBe(1);
    expect(response[0].nModified).toBe(1);
    expect(response[1].description).toBe('oil chain');
  });

  test('Valid existing non-repeating maintenanceTask', async () => {
    expect.assertions(3);
    let response = await maintenanceTaskService.MarkCompleted([maintSchedule2]);
    expect(response.length).toBe(2);
    expect(response[0]).toBe(true);
    expect(response[1].description).toBe('tire check');
  });

  test('Valid existing non-repeating maintenanceTask', async () => {
    expect.assertions(3);
    let response = await maintenanceTaskService.MarkCompleted([
      maintSchedule1,
      maintSchedule2,
    ]);
    expect(response).toBe(2);
    expect(response[0]).toBe(true);
    expect(response[1].description).toBe('tire check');
  });
});

describe('Update(maintenanceTask) Test Cases', () => {
  test('Update existing maintainenceTask with new changes', async () => {
    expect.assertions(2);
    let response = await maintenanceTaskService.Update(maintSchedule3Update);
    expect(response.n).toBe(1);
    expect(response.nModified).toBe(1);
  });

  test('Update existing maintainenceTask with no changes', async () => {
    expect.assertions(2);
    let response = await maintenanceTaskService.Update(maintSchedule3);
    expect(response.n).toBe(1);
    expect(response.nModified).toBe(0);
  });
});

describe('Delete(maintenanceTask) Test Cases', () => {
  test('Delete existing maintainenceTask', async () => {
    expect.assertions(1);
    let response = await maintenanceTaskService.Delete(maintSchedule3);
    expect(response).toBe(true);
  });

  test('Delete non-existing maintainenceTask', async () => {
    expect.assertions(1);
    let respose = await maintenanceTaskService.Delete(maintSchedule4);
    expect(respose).toBe(false);
  });
});

describe('MaintenanceRecordFromTask(maintenanceTask) Test Cases', () => {
  test('Make record from existing maintainenceTask', async () => {
    expect.assertions(3);
    let record = await maintenanceTaskService.MaintenanceRecordFromTask(
      maintSchedule3,
    );

    expect(record.description).toBe('brake check');
    expect(record.component_id).toBe(1);
    expect(record.maintenance_date).toStrictEqual(new Date('2020-09-26'));
  });
});

describe('GetTaskScheduleForUser(userId) Test Cases', () => {
  test('Get tasks for user - Update mock data dates', async () => {
    expect.assertions(8);
    let schedule = await maintenanceTaskService.GetTaskScheduleForUser(1);
    expect(schedule[0].title).toBe('Overdue');
    expect(schedule[0].data[0].description).toBe('oil chain'); //maintSchedule1
    expect(schedule[1].title).toBe('Today');
    expect(schedule[1].data.length).toBe(0);
    expect(schedule[2].title).toBe('Next 7 Days');
    expect(schedule[2].data[0].description).toBe('tire check'); //maintSchedule2
    expect(schedule[3].title).toBe('Upcoming');
    expect(schedule[3].data[0].description).toBe('brake check'); //maintSchedule3
  });
});

describe('GetScheduledTasksSorted(userId, numDays) Test Cases', () => {
  test('Get and sort tasks in date range, numDays = 0', async () => {
    expect.assertions(4);
    let sortedList = await maintenanceTaskService.GetScheduledTasksSorted(1);
    expect(sortedList.length).toBe(3);
    expect(sortedList[0].description).toBe('oil chain'); //maintSchedule1
    expect(sortedList[1].description).toBe('tire check'); //maintSchedule2
    expect(sortedList[2].description).toBe('brake check'); //maintSchedule3
  });

  test('Get and sort tasks in date range, numDays = 30', async () => {
    expect.assertions(3);
    let sortedList = await maintenanceTaskService.GetScheduledTasksSorted(
      1,
      30,
    );
    expect(sortedList.length).toBe(2);
    expect(sortedList[0].description).toBe('oil chain'); //maintSchedule1
    expect(sortedList[1].description).toBe('tire check'); //maintSchedule2
  });
});

//TODO: addDays test cases
describe('addDays(currentDate, daysToAdd) Test Cases', () => {
  test('Check negative days to add', () => {
    expect.assertions(1);
    let response = maintenanceTaskService.addDays(new Date('2020-11-10'), -2);
    expect(response).toStrictEqual(new Date('2020-11-08'));
  });

  test('Check positive days to add', () => {
    expect.assertions(1);
    let response = maintenanceTaskService.addDays(new Date('2020-11-10'), 5);
    expect(response).toStrictEqual(new Date('2020-11-15'));
  });

  test('Check 0 days to add', () => {
    expect.assertions(1);
    let response = maintenanceTaskService.addDays(new Date('2020-11-10'), 0);
    expect(response).toStrictEqual(new Date('2020-11-10'));
  });
});

describe('GetTasksForComponent(componentId) Test Cases', () => {
  test('Get task with valid componentId', async () => {
    expect.assertions(2);
    let tasks = await maintenanceTaskService.GetTasksForComponent([3]);
    expect(tasks.length).toBe(1);
    expect(tasks[0].description).toBe('tire check');
  });

  test('Get task with valid componentId', async () => {
    expect.assertions(1);
    let tasks = await maintenanceTaskService.GetTasksForComponent([1, 3]);
    expect(tasks.length).toBe(3);
  });
});

describe('MaintenancePredictForComponent(componentId) Test Cases', () => {
  test('Maintenance Predict with one valid componentId', async () => {
    expect.assertions(2);
    let predictions = await maintenanceTaskService.MaintenancePredictForComponent(
      [3],
    );
    expect(predictions.length).toBe(1);
    expect(predictions[0]).toBe('11/1/2020');
  });

  test('Maintenance Predict with multiple valid componentId', async () => {
    expect.assertions(3);
    let predictions = await maintenanceTaskService.MaintenancePredictForComponent(
      [1, 3],
    );
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toBe('11/18/2020');
    expect(predictions[1]).toBe('11/1/2020');
  });
});

describe('MaintenancePredictForUser(userId) Test Cases', () => {
  test('Get task with valid userId', async () => {
    expect.assertions(3);
    let predictions = await maintenanceTaskService.MaintenancePredictForUser(1);
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toBe('11/1/2020');
    expect(predictions[1]).toBe('11/18/2020');
  });
});

//TODO: Double check dates with concrete data
describe('MaintenancePredict(maintenanceList) Test Cases', () => {
  test('Get task with valid componentId', async () => {
    expect.assertions(3);
    let predictions = await maintenanceTaskService.MaintenancePredict(
      schedule_data,
    );
    expect(predictions.length).toBe(2);
    expect(predictions[0]).toBe('11/1/2020');
    expect(predictions[1]).toBe('11/18/2020');
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
