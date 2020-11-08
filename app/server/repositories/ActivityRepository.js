const Repository = require('./Repository');
const userRepository = require('./UserRepository');
const ActivityModel = require('../schemas/Activity').ActivityModel;

class ActivityRepository extends Repository {
  constructor(activityModel) {
    super(activityModel);
  }

  GetActivitiesAfterDateForUser(userId, date) {
    this.documentModel
      .find({athlete_id: userId, date: {$gte: date}})
      .exec()
      .then((activities) => {
        return activities;
      })
      .catch((err) => {
        console.error(err);
        throw new Error(
          'Could not fetch activities for user: ' +
            userId +
            'before date: ' +
            date,
        );
      });
  }
}
const activityRepository = new ActivityRepository(ActivityModel);
module.exports = activityRepository;
