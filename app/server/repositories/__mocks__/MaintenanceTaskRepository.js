const mongoose = require('mongoose');
const Repository = require('./Repository');
const _ = require('lodash');

class MaintenanceTaskRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['getForUser'] = 0;
  }

  GetMaintenanceTasksForUser(userId) {
    this.count['getForUser']++;
    return new Promise((resolve, reject) => {
      if (userId === 0) {
        throw new mongoose.Error.ValidationError('Validation error');
      } else if (this.count['getForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (userId) {
          case 1:
            resolve(this.data);
            break;
          case 2:
            resolve([maintSchedule6]);
            break;
          default:
            resolve([]);
            break;
        }
      }
    });
  }

  GetMaintenanceTasksForComponents(componentIds) {
    this.count['getForUser']++;
    return new Promise((resolve, reject) => {
      if (componentIds === 0) {
        throw new mongoose.Error.ValidationError('Validation error');
      } else if (this.count['getForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        let returnData = [];
        if (!Array.isArray(componentIds)) {
          componentIds = [componentIds];
        }
        for (let index = 0; index < componentIds.length; index++) {
          if (
            new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca').equals(
              componentIds[index],
            )
          ) {
            //check to avoid duplicate
            if (returnData.length <= 1) {
              returnData.push(maintSchedule1);
              returnData.push(maintSchedule3);
            }
          } else if (
            new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb').equals(
              componentIds[index],
            )
          ) {
            if (returnData.length !== 1) {
              returnData.push(maintSchedule2);
            }
          }
        }
        resolve(returnData);
      }
    });
  }
}

//MOCK DATA USED FOR TESTING
const MILLISECONDS_IN_DAY = 86400000;
let today = new Date();
let dayOverdue = new Date(today.getTime() - 20 * MILLISECONDS_IN_DAY);
let dayIn7Days = new Date(today.getTime() + 5 * MILLISECONDS_IN_DAY);
let dayUpcoming = new Date(today.getTime() + 30 * MILLISECONDS_IN_DAY);

const maintSchedule1 = {
  _id: 1,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  schedule_type: 'date',
  threshold_val: 30,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: true,
  predicted_due_date: dayOverdue, //new Date('2020-11-11'),
};

const maintSchedule2 = {
  _id: 2,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb'),
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'tire check',
  last_maintenance_val: new Date('2020-10-10'),
  repeats: false,
  predicted_due_date: dayUpcoming, //new Date('2021-01-05'),
};

const maintSchedule3 = {
  _id: 3,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  schedule_type: 'distance',
  threshold_val: 200,
  description: 'brake check',
  last_maintenance_val: new Date('2020-09-26'),
  repeats: true,
  predicted_due_date: dayIn7Days, //new Date('2020-12-07'),
};

let todayWithTime = new Date();

const maintSchedule4 = {
  _id: 4,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  schedule_type: 'date',
  threshold_val: 500,
  description: 'brake check',
  last_maintenance_val: new Date('2020-10-08'),
  repeats: false,
  predicted_due_date: new Date(
    todayWithTime.getFullYear(),
    todayWithTime.getMonth(),
    todayWithTime.getDate(),
  ),
};

const maintSchedule6 = {
  _id: 60,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cd'),
  schedule_type: 'distance',
  threshold_val: 130,
  description: 'pump tire',
  last_maintenance_val: new Date('2020-11-08'),
  repeats: true,
  predicted_due_date: undefined,
};

var data = [maintSchedule1, maintSchedule2, maintSchedule3, maintSchedule4];

var maintTaskRepo = new MaintenanceTaskRepository(data);

module.exports = maintTaskRepo;
