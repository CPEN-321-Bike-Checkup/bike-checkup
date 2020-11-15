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
        reject(Mongoose.Error.ValidationError);
      } else if (this.count['afterDateForUser'] === 0) {
        reject(new Error('internal server error'));
      } else {
        resolve(this.data);
      }
    });
  }
}

var data = [];

var activityRepo = ActivityRepository(data);

module.exports = activityRepo;
