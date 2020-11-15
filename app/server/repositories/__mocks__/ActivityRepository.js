const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class ActivityRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['afterDateForUser'] = 0;
  }

  GetActivitiesAfterDateForUser(userId, date) {
    this.count['afterDateForUser']++;
    return new Promise((resolve, reject) => {
      if (userId === 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['afterDateForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        resolve(this.data);
      }
    });
  }
}

const activity1 = {
  //activity_id: 1,
  description: 'test',
  distance: 50,
  time_s: 360,
  date: new Date('2020-10-21'),
  components: [1],
};

const activity2 = {
  //activity_id: 2,
  description: 'test2',
  distance: 30,
  time_s: 300,
  date: new Date('2020-10-22'),
  components: [2],
};

const activity3 = {
  //activity_id: 3,
  description: 'test3',
  distance: 50,
  time_s: 320,
  date: new Date('2020-10-22'),
  components: [3],
};

const activity4 = {
  //activity_id: 4,
  description: 'test4',
  distance: 60,
  time_s: 400,
  date: new Date('2020-10-25'),
  components: [3],
};
var data = [activity1, activity2, activity3, activity4];

var activityRepo = new ActivityRepository(data);

module.exports = activityRepo;
