const mongoose = require('mongoose');
const Repository = require('./Repository');

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
        resolve(this.data);
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
        for (let index = 0; index < componentIds.length; index++) {
          if (
            componentIds[index].equals(
              new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
            )
          ) {
            //check to avoid duplicate
            if (returnData.length <= 1) {
              returnData.push(maintSchedule1);
              returnData.push(maintSchedule3);
            }
          } else if (
            componentIds[index].equals(
              new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb'),
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

const maintSchedule1 = {
  _id: 1,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  schedule_type: 'date',
  threshold_val: 30,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: true,
  predicted_due_date: new Date('2020-11-11'),
};

const maintSchedule2 = {
  _id: 2,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb'),
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'tire check',
  last_maintenance_val: new Date('2020-10-10'),
  repeats: false,
  predicted_due_date: new Date('2020-12-05'),
};

const maintSchedule3 = {
  _id: 3,
  component_id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  schedule_type: 'distance',
  threshold_val: 200,
  description: 'brake check',
  last_maintenance_val: new Date('2020-09-26'),
  repeats: true,
  predicted_due_date: new Date('2021-03-20'),
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

var data = [maintSchedule1, maintSchedule2, maintSchedule3, maintSchedule4];

var maintTaskRepo = new MaintenanceTaskRepository(data);

module.exports = maintTaskRepo;
