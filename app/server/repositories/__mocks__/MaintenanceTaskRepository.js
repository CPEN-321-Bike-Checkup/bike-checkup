const {Mongoose} = require('mongoose');
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
        reject(Mongoose.Error.ValidationError);
      } else if (this.count['getForUser'] === 0) {
        reject(new Error('internal server error'));
      } else {
        resolve(this.data);
      }
    });
  }
}
const maintSchedule1 = {
  maintenance_id: 1,
  component_id: 1,
  schedule_type: 'date',
  threshold_val: 450,
  description: 'oil chain',
  last_maintenance_val: new Date('2020-10-11'),
  repeats: false,
  predicted_due_date: new Date('2020-11-22'),
};

const maintSchedule2 = {
  maintenance_id: 2,
  component_id: 3,
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'tire check',
  last_maintenance_val: new Date('2020-11-10'),
  repeats: true,
  predicted_due_date: new Date('2020-11-25'),
};

const maintSchedule3 = {
  maintenance_id: 3,
  component_id: 1,
  schedule_type: 'distance',
  threshold_val: 180,
  description: 'brake check',
  last_maintenance_val: new Date('2020-11-08'),
  repeats: true,
  predicted_due_date: new Date('2020-11-15'),
};

var data = [maintSchedule1, maintSchedule2, maintSchedule3];

var maintTaskRepo = MaintenanceTaskRepository(data);

module.exports = maintTaskRepo;
